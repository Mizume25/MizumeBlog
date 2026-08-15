<?php

namespace App\Services;

use App\Models\ArtworkImage;
use App\Models\Post;
use Illuminate\Support\Str;
use Illuminate\Support\Collection;

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

    /** Devuelve los keys usados en el texto que no tienen PostImage asociado */
    public static function missingImageKeys(string $content, Post $post): Collection
    {
        preg_match_all('/\{\{img:([\w-]+)\}\}/', $content, $matches);

        $keysinContent = collect($matches[1])->unique();

        $keysAssociated = $post->images()->pluck('key');

        return $keysinContent->diff($keysAssociated);
    }

    /**
     * Recorre el markdown, sincroniza post_images con las keys reales del texto,
     * y devuelve las keys nuevas que aún no tienen imagen asignada.
     */
    public static function syncKeys(string $content, Post $post): array
    {
        preg_match_all('/\{\{img:([\w-]+)\}\}/', $content, $matches);
        $keysEnTexto = collect($matches[1])->unique();

        $keysExistentes = $post->images()->pluck('key');

        // Keys que ya no están en el texto -> se borran de post_images
        $keysHuerfanas = $keysExistentes->diff($keysEnTexto);
        if ($keysHuerfanas->isNotEmpty()) {
            $post->images()->whereIn('key', $keysHuerfanas)->delete();
        }

        // Keys nuevas en el texto que aún no tienen fila en post_images
        $keysNuevas = $keysEnTexto->diff($keysExistentes);

        return $keysNuevas->values()->toArray();
    }
}
