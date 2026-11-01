<?php

namespace App\Services;

use App\Models\ArtworkImage;
use App\Models\Post;
use Illuminate\Support\Str;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use App\Enums\ContentType;


class MarkdownService
{

    /*** Veremos si el documento es valido */
    public static function hasHeading(string $content): bool
    {
        return preg_match('/^#{2}\s+.+$/m', $content) === 1;
    }

    /** Extraremos todos los ## y los convierte en json */
    public static function extract(string $content): array
    {
        preg_match_all('/^#{2}\s+(.+)$/m', $content, $matches, PREG_SET_ORDER);

        $index = [];
        $seen  = [];

        foreach ($matches as $match) {
            $title = trim($match[1]);
            $slug  = Str::slug($title);

            if (isset($seen[$slug])) {
                $seen[$slug]++;
                $slug .= '-' . $seen[$slug];
            } else {
                $seen[$slug] = 0;
            }

            $index[] = [
                'id'    => $slug,
                'titulo' => $title,
            ];
        }

        return $index;
    }


    /** Genera un Markdown  de ejemplo */
    public static function generate()
    {
        $path =  storage_path('app/private/Plantilla.md');

        $content = file_get_contents($path);


        return $content;
    }

    /** Reemplaza los placeholders {{img:key}} por sintaxis markdown de imagen real */
    public static function resolveImages(string $content, Post $post): string
    {
        return preg_replace_callback('/\{\{img:([\w-]+)\}\}/', function ($matches) use ($post) {
            $key = $matches[1];

            $postImage = $post->images()->where('key', $key)->first();

            if (!$postImage) return "**[imagen no encontrada: {$key}]**";


            $artworkImage = $postImage->image;
            $url = static::build($artworkImage);
            $alt = $artworkImage->alt ?? '';

            return "![{$alt}]({$url})";
        }, $content);
    }


    /** Construye la URL pública de una imagen a partir de su ArtworkImage */
    protected static function build(ArtworkImage $AI): string
    {

        return "/storage/IMG/{$AI->artwork->code}/{$AI->name}";
    }


    /**
     * Recorre el markdown, sincroniza post_images con las keys reales del texto,
     * y devuelve las keys nuevas que aún no tienen imagen asignada.
     * @param $content
     * @param $post
     * @param $dryRun
     */
    public static function syncKeys(string $content, Post $post, bool $dryRun = false): array
    {
        preg_match_all('/\{\{img:([\w-]+)\}\}/', $content, $matches);
        $keysEnTexto = collect($matches[1])->unique();

        $keysExistentes = $post->images()->pluck('key');

        // Keys que ya no están en el texto -> se borran de post_images
        // Solo si NO estamos en modo "dry run" (solo consulta)
        if (!$dryRun) {
            $keysHuerfanas = $keysExistentes->diff($keysEnTexto);
            if ($keysHuerfanas->isNotEmpty()) {
                $post->images()->whereIn('key', $keysHuerfanas)->delete();
            }
        }

        // Keys nuevas en el texto que aún no tienen fila en post_images
        $keysNuevas = $keysEnTexto->diff($keysExistentes);

        return $keysNuevas->values()->toArray();
    }

    /** Verifica si una key específica existe en el markdown actual del post */
    public static function keyExistsInPost(string $key, Post $post): bool
    {
        $content = Storage::disk('local')->get($post->path(ContentType::Content));
        preg_match_all('/\{\{img:([\w-]+)\}\}/', $content, $matches);
        return in_array($key, $matches[1]);
    }

    /** Comprueba el indice tenga valores únicos
     * @param array $index
     */
    public static function testIndex(array $index): bool
    {
        $ids = array_column($index, 'id');

        return count($ids) !== count(array_unique($ids));
    }

    /**
     * Colocal ids correspondientes
     */
    public static function embedIds(string $content, array $index): string
    {
        $i = 0;
        return preg_replace_callback('/^(#{2}\s+.+)$/m', function ($match) use ($index, &$i) {
            $id = $index[$i]['id'] ?? null;
            $i++;
            return $id ? "{$match[1]} {#{$id}}" : $match[1];
        }, $content);
    }

    /**
     * Transforma los wiki links en claves
     */
    public static function convertWikiImages(string $content): string
    {
        $usedKeys = [];

        return preg_replace_callback(
            '/!\[\[([^\]|]+\.(?:webp|png|jpe?g|gif|svg))(?:\|[^\]]*)?\]\]/i',
            function () use (&$usedKeys) {
                do {
                    $key = Str::lower(Str::random(10));
                } while (isset($usedKeys[$key]));

                $usedKeys[$key] = true;

                return "{{img:{$key}}}";
            },
            $content
        );
    }

    /**
     * Elimina el bloque de frontmatter YAML (---...---) al inicio del
     * documento, si existe. Es metadata de Obsidian, no pertenece al
     * contenido del blog.
     */
    public static function stripFrontmatter(string $content): string
    {
        return preg_replace('/^---\s*\n.*?\n---\s*\n/s', '', $content, 1);
    }

    /** Limpiado de citas */
    public static function stripCitationLinks(string $content): string
    {
        return preg_replace_callback(
            '/(?<!!)\[\[((?:[^\[\]]|\[[^\[\]]*\])+)\]\]/',
            function ($match) {
                $inner = $match[1];

                if (str_contains($inner, '|')) {
                    [, $alias] = explode('|', $inner, 2);
                    return trim($alias);
                }

                return trim($inner); // red de seguridad, no debería dispararse en tu flujo normal
            },
            $content
        );
    }


   

    /**
     * Funcion Envolvente
     */
    public static function cleanAllMD(string $content)
    {
        $content = static::convertWikiImages($content);
        $content = static::stripFrontmatter($content);
        $content = static::stripCitationLinks($content);

        return $content;
    }
}
