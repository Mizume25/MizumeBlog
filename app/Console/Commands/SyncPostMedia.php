<?php

namespace App\Console\Commands;

use App\Enums\ArticleType;
use App\Models\Post;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Registra en la galería de cada post (colección 'gallery') las imágenes que su markdown
 * referencia como ![alt](media:clave).
 *
 * La clave se busca en public/IMG/Cards y public/IMG/Banners comparando con el slug
 * del nombre del archivo (P-c-tatakau-shisho.jpg → p-c-tatakau-shisho).
 * Idempotente: si el post ya tiene esa imagen, la salta.
 */
class SyncPostMedia extends Command
{
    protected $signature = 'posts:sync-media';

    protected $description = 'Asocia a la galería de cada post las imágenes media: de su markdown';

    /** Carpetas donde se buscan los archivos de origen */
    private const SOURCES = ['IMG/Cards', 'IMG/Banners'];

    public function handle(): int
    {
        // clave (slug) → ruta absoluta del archivo de origen
        $files = collect(self::SOURCES)
            ->flatMap(fn($dir) => File::files(public_path($dir)))
            ->keyBy(fn($file) => Str::slug($file->getFilenameWithoutExtension()))
            ->map(fn($file) => $file->getPathname());

        $added = 0;
        $missing = [];

        Post::articles()->with('user')->each(function (Post $post) use ($files, &$added, &$missing) {
            // toBase(): colección normal de strings (la de Eloquent espera modelos en contains())
            $existing = $post->getMedia('gallery')->toBase()->map(fn($m) => Str::slug($m->name));

            foreach ($this->keys($post) as $key) {
                if ($existing->contains($key)) {
                    continue;
                }

                if (! $files->has($key)) {
                    $missing[] = "{$post->code}: {$key}";
                    continue;
                }

                $post->addMedia($files[$key])
                    ->preservingOriginal()
                    ->usingName($key)
                    ->toMediaCollection('gallery');

                $existing->push($key);
                $added++;
            }
        });

        $this->info("Imágenes añadidas: {$added}");

        foreach ($missing as $line) {
            $this->warn("Sin archivo de origen → {$line}");
        }

        return self::SUCCESS;
    }

    /**
     * Claves media: únicas de todos los idiomas del post (content.md, content_en.md...)
     */
    private function keys(Post $post): array
    {
        $base = match ($post->article_type) {
            ArticleType::Work   => $post->user->path($post->code),
            ArticleType::Author => "authors/{$post->code}/",
            default             => null,
        };

        if ($base === null) {
            return [];
        }

        $disk = Storage::disk('local');
        $keys = [];

        foreach ($disk->files($base) as $path) {
            if (! Str::endsWith($path, '.md')) {
                continue;
            }

            preg_match_all('/!\[[^\]]*\]\(media:([\w-]+)\)/', $disk->get($path), $m);
            array_push($keys, ...$m[1]);
        }

        return array_values(array_unique($keys));
    }
}
