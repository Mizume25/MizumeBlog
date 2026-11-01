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
    

    /**
     * Funcion para conter el numero de secciones
     */
    public static function countSections(string $content): int
    {
        return preg_match_all('/^##[ \t]+\S/m', $content);
    }

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

    public static function layout (string $content) 
    {
        $sections = static::countSections($content);



        return [
            'sections' => $sections,
            
        ];
    }
}
