<?php

namespace App\Services;

use App\Models\Post;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;

enum ImageType: string
{
    case Cover = 'cover';
    case Card = 'card';
}



/**
 * Servcios de recogida / inyección de contenido 
 */
class FileContentService
{



    /**
     * Obtener contenido
     * @param $id del post
     * @param $title titulo de la obra
     */
    public function getPath(int $id, string $title): string
    {
        return storage_path('app/private/blog' . '/' . $id . '-' . Str::slug($title));
    }

    public function getPath__p(int $id , string $title) : string 
    {
        return storage_path('app/public/IMG' . '/' . $id . '-' . Str::slug($title));
    }

    /**
     * Modificar titulo
     * 
     */


    /**
     * Modificar Archivos  y Rutas de Portadas y Imagenes
     * @param UploadedFile $file - Imagen
     * @param ImageType $type - Tipo de imagen Card , Portada , Banner
     * 
     */
    public function modifyImages(ImageType $type, UploadedFile $file): string
    {
        $ext = $file->extension();
        $slug = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));

        $prefix = match ($type) {
            ImageType::Cover => 'P',
            ImageType::Card  => 'C',
        };

        return "{$prefix}-{$slug}.{$ext}";
    }


    public function buildTags()
    {
        $items = Post::tags();
        $tags = collect($items);

        $tags = collect($items)
            ->flatMap(fn($item) => explode(',', $item))
            ->map(fn($g) => trim($g))
            ->filter()
            ->unique()
            ->values()
            ->all();

        return $tags;
    }


    public static function parseTags(string $raw): array
    {
        return collect(explode(',', $raw))
            ->map(fn($tag) => trim($tag))
            ->filter()
            ->unique()
            ->values()
            ->all();
    }
}
