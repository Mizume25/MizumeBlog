<?php

namespace App\Services;

use App\Enums\ArticleType;
use App\Enums\PostType;
use App\Models\Post;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use InvalidArgumentException;
use RuntimeException;

class MarkdownService
{
    private const DISK = 'local';

    /** Idioma base: sus archivos no llevan sufijo (content.md); el resto lleva _{locale} (content_en.md) */
    private const DEFAULT_LOCALE = 'es';

    /**
     * Maquetación de un post: markdown, índice (index.json) y número de secciones.
     *
     * El tipo se toma de $post->type. En los article, si no se indica $article,
     * se deduce del propio post (work_id → work · author_id → author).
     *
     * @return array{content: string, index: array, sections: int}
     */
    public function build(Post $post, ?ArticleType $article = null): array
    {
        [$content, $index] = $this->read($this->resolvePaths($post, $article ?? $post->article_type));

        $content = $this->resolveMedia($content, $post);

        return [
            'content'  => $content,
            'index'    => $index,
            'sections' => $this->countSections($content),
        ];
    }


    /**
     * Sustituye ![alt](media:clave) por la URL pública de la imagen de la galería del post.
     *
     * La resolución se hace en servidor: react-markdown vacía las URLs con protocolos
     * desconocidos (media:), así que el frontend no podría resolverlas.
     * La clave se compara con el slug del nombre (P-c-tatakau-shisho → p-c-tatakau-shisho).
     * Una sola consulta para todo el markdown; si falta la imagen, deja un aviso visible.
     */
    private function resolveMedia(string $content, Post $post): string
    {
        $gallery = $post->getMedia('gallery')->keyBy(fn($m) => Str::slug($m->name));

        return preg_replace_callback(
            '/!\[([^\]]*)\]\(media:([\w-]+)\)/',
            fn($m) => ($media = $gallery->get($m[2]))
                ? "![{$m[1]}]({$media->getUrl()})"
                : "**[imagen no encontrada: {$m[2]}]**",
            $content
        );
    }

    /**
     * Funcion para conter el numero de secciones
     */
    public function countSections(string $content): int
    {
        return preg_match_all('/^##[ \t]+\S/m', $content);
    }

    /**
     * Construye el índice jerárquico del markdown a partir de los encabezados
     * de nivel ## (mínimo) a ###### (máximo).
     *
     * Cada nodo: ['id' => '1.2.1', 'title' => '...', 'children' => [...]]
     * El id se calcula por posición. Se ignoran los encabezados dentro de
     * bloques de código (``` o ~~~). Si se salta un nivel, el nodo se cuelga
     * del último padre abierto.
     */
    public function extract(string $content): array
    {
        $index = [];

        /** Pila de padres abiertos: cada entrada ['level' => int, 'node' => &array] */
        $stack = [];
        $fence = null;

        foreach (preg_split('/\R/', $content) as $line) {

            if (preg_match('/^\s{0,3}(`{3,}|~{3,})/', $line, $f)) {
                if ($fence === null) {
                    $fence = $f[1][0];
                } elseif ($f[1][0] === $fence) {
                    $fence = null;
                }
                continue;
            }

            if ($fence !== null) {
                continue;
            }

            if (! preg_match('/^(#{2,6})[ \t]+(.+?)[ \t]*#*[ \t]*$/', $line, $m)) {
                continue;
            }

            $level = strlen($m[1]);
            $title = trim($m[2]);

            if ($title === '') {
                continue;
            }

            while ($stack && end($stack)['level'] >= $level) {
                array_pop($stack);
            }

            if ($stack) {
                $parent = &$stack[array_key_last($stack)]['node'];
                $id = $parent['id'] . '.' . (count($parent['children']) + 1);
                $parent['children'][] = ['id' => $id, 'title' => $title, 'children' => []];
                $node = &$parent['children'][array_key_last($parent['children'])];
                unset($parent);
            } else {
                $id = (string) (count($index) + 1);
                $index[] = ['id' => $id, 'title' => $title, 'children' => []];
                $node = &$index[array_key_last($index)];
            }

            $stack[] = ['level' => $level, 'node' => &$node];
            unset($node);
        }

        return $index;
    }



    /**
     * Resuelve las rutas (content + index) según el tipo del post.
     *
     * - Contenido del sitio (community, legality, policies): estricto, debe existir
     *   en el idioma activo.
     * - Contenido de usuario (article): si no existe en el idioma activo se muestra
     *   en castellano.
     *
     * @return array{content: string, index: string}
     */
    private function resolvePaths(Post $post, ?ArticleType $article): array
    {
        return match ($post->type) {
            PostType::Article   => $this->articlePaths(
                $post,
                $article ?? throw new InvalidArgumentException('Un post de tipo article requiere ArticleType')
            ),
            PostType::Community => $this->localized("{$post->code}/Mizumeblog", "{$post->code}/Mizumeblog", strict: true),
            PostType::Legality  => $this->localized("legality/{$post->code}/content", "legality/{$post->code}/index", strict: true),
            PostType::Policy    => $this->localized("policies/{$post->code}/content", "policies/{$post->code}/index", strict: true),
        };
    }

    /**
     * Artículos: work → blog/{uuid}/{code}/ · author → authors/{code}/
     */
    private function articlePaths(Post $post, ArticleType $article): array
    {
        $post->loadMissing('user');

        $base = match ($article) {
            ArticleType::Work   => $post->user->path($post->code),
            ArticleType::Author => "authors/{$post->code}/",
        };

        return $this->localized($base . 'content', $base . 'index', strict: false);
    }

    /**
     * Rutas del idioma activo a partir de rutas sin extensión ni sufijo.
     * es → content.md / index.json · en → content_en.md / index_en.json
     *
     * @param bool $strict true: falla si no existe en el idioma activo ·
     *                     false: recurre al castellano
     * @throws RuntimeException si $strict y falta el archivo del idioma activo
     */
    private function localized(string $content, string $index, bool $strict): array
    {
        $locale = app()->getLocale();
        $suffix = $locale === self::DEFAULT_LOCALE ? '' : "_{$locale}";

        $paths = [
            'content' => "{$content}{$suffix}.md",
            'index'   => "{$index}{$suffix}.json",
        ];

        if (Storage::disk(self::DISK)->exists($paths['content'])) {
            return $paths;
        }

        if ($strict) {
            throw new RuntimeException("Falta el contenido del sitio en '{$locale}': {$paths['content']}");
        }

        return [
            'content' => "{$content}.md",
            'index'   => "{$index}.json",
        ];
    }

    /**
     * Lee markdown e índice del disco; si no existen devuelve vacío
     * @return array{0: string, 1: array}
     */
    private function read(array $paths): array
    {
        $disk = Storage::disk(self::DISK);

        $content = $disk->get($paths['content']) ?? '';
        $index   = json_decode($disk->get($paths['index']) ?? '[]', true) ?? [];

        return [$content, $index];
    }
}
