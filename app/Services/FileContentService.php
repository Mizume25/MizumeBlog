<?php

namespace App\Services;

use App\Models\Post;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;
use App\Enums\ImageType;
use App\Models\Artwork;
use App\Models\ArtworkImage;
use App\Models\PostImage;
use Illuminate\Support\Facades\Storage;
use App\Enums\ContentType;

/**
 * Servcios de recogida / inyección de contenido general
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

    public function getPath__p(int $id, string $title): string
    {
        return storage_path('app/public/IMG' . '/' . $id . '-' . Str::slug($title));
    }

    /**
     * Modificar titulo
     * 
     */

    /**
     * Construir Tags
     */
    public function parseTags(string $raw): array
    {
        return collect(explode(',', $raw))
            ->map(fn($tag) => trim($tag))
            ->filter()
            ->unique()
            ->values()
            ->all();
    }



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


    /**
     * Construir array de tags
     */
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



    /**
     * Funcion para guardar imagenes 
     */
    public function saveImages(array $images, array $photos, Artwork $artwork, ?int $post_id = null): array
    {
        $next = ($artwork->images()->max('num') ?? 0) + 1;

        $pendingKeys = [];
        $post = null;

        if ($post_id) {
            $post = Post::findOrFail($post_id);
            $content = Storage::disk('local')->get($post->path(ContentType::Content));
            $pendingKeys = MarkdownService::syncKeys($content, $post, dryRun: true);
        }

        $unassociated = [];

        foreach ($images as $i => $image) {
            $alt = $photos[$i]['alt'] ?? null;
            $name = $this->hashName($image->getClientOriginalName());

            Storage::disk('public')->putFileAs("IMG/{$artwork->code}", $image, $name);

            $artworkImage = ArtworkImage::create([
                'artwork_id' => $artwork->id,
                'num' => $next + $i,
                'name' => $name,
                'alt' => $alt,
            ]);

            if ($post && isset($pendingKeys[$i])) {
                PostImage::create([
                    'post_id' => $post->id,
                    'artwork_image_id' => $artworkImage->id,
                    'key' => $pendingKeys[$i],
                ]);
            } elseif ($post_id) {
                $unassociated[] = $image->getClientOriginalName();
            }
        }


        return $unassociated;
    }

    /**
     * Helpers
     */
    private function hashName(string $name): string
    {
        $ext = pathinfo($name, PATHINFO_EXTENSION);
        $hash = Str::random(12);

        return $ext ? "{$hash}.{$ext}" : $hash;
    }
}
