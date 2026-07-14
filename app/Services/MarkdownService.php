<?php

namespace App\Services;

use Illuminate\Support\Str;

class MarkdownService
{

    /*** Veremos si el documento es valido */
    public static function hasHeading(string $content): bool
    {
        return preg_match('/^#{2}\s+.+$/m', $content) === 1;
    }

    /** Extraremos todos los ##  */
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


    public static function generate() 
    {
        $path =  storage_path('app/private/Plantilla.md');

        $content = file_get_contents($path);


        return $content;

        
    }
}
