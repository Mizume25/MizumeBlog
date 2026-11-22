<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Media;
use App\Models\Work;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\HasMedia;

/**
 * Imágenes de los datos de prueba, todas registradas en la tabla media y con créditos de artista:
 *
 * - works   → cover   (aleatoria de public/IMG/Cards)
 * - authors → profile (aleatoria de public/IMG/Cards)
 * - posts   → gallery (las que su markdown ya referencia como ![alt](media:clave), vía posts:sync-media)
 *
 * Debe ejecutarse después de ContentSeeder (necesita los .md en disco).
 */
class MediaSeeder extends Seeder
{
    private const CARDS = 'IMG/Cards';

    /** Archivos de Cards que no son portadas */
    private const EXCLUDE = ['Icono.jpg'];

    private const MEDIA_DISK = 'public';

    public function run(): void
    {
        $this->cleanOrphanFolders();

        $cards = collect(File::files(public_path(self::CARDS)))
            ->reject(fn($file) => in_array($file->getFilename(), self::EXCLUDE, true))
            ->map(fn($file) => $file->getPathname())
            ->values();

        Work::all()->each(fn(Work $work) => $this->attach($work, $cards->random(), 'cover'));
        Author::all()->each(fn(Author $author) => $this->attach($author, $cards->random(), 'profile'));

        // Galería: imágenes que el markdown ya usa (media:clave) → registro en media
        Artisan::call('posts:sync-media');
        $this->command?->line(trim(Artisan::output()));

        Media::where('collection_name', 'gallery')->get()
            ->reject(fn(Media $media) => $media->hasCredit())
            ->each(fn(Media $media) => $this->fakeCredit($media)->save());

        $this->command?->info('Media: ' . Media::count() . ' imágenes registradas, todas con créditos');
    }

    private function attach(HasMedia $model, string $path, string $collection): void
    {
        [$artist, $social] = $this->fakeArtist();

        $model->addMedia($path)
            ->preservingOriginal()
            ->withCustomProperties(Media::creditProperties($artist, $social))
            ->toMediaCollection($collection);
    }

    private function fakeCredit(Media $media): Media
    {
        return $media->setCredit(...$this->fakeArtist());
    }

    /** @return array{0: string, 1: ?string} artista y red social (texto libre, a veces URL, a veces nada) */
    private function fakeArtist(): array
    {
        $handle = fake()->userName();

        return [
            fake()->name(),
            fake()->randomElement([
                "@{$handle} en Pixiv",
                "https://www.artstation.com/{$handle}",
                "https://x.com/{$handle}",
                "@{$handle}",
                null,
            ]),
        ];
    }

    /**
     * Spatie guarda cada imagen en {media.id}/: tras un migrate:fresh los ids vuelven a empezar
     * y los archivos nuevos se mezclarían con los antiguos. Solo actúa si la tabla media está vacía.
     */
    private function cleanOrphanFolders(): void
    {
        if (Media::query()->exists()) {
            return;
        }

        $disk = Storage::disk(self::MEDIA_DISK);

        $orphans = collect($disk->directories())->filter(fn($dir) => ctype_digit($dir));
        $orphans->each(fn($dir) => $disk->deleteDirectory($dir));

        $this->command?->line("Carpetas de media huérfanas eliminadas: {$orphans->count()}");
    }
}
