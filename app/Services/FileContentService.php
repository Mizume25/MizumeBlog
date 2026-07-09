<?php

namespace App\Services;
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
    public function getPath(int $id, string $title) : string 
    {
        return storage_path('app/private/blog' . '/' . $id . '-' . Str::slug($title));
       
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

}



?>