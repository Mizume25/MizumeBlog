<?php

namespace Database\Seeders;

use App\Enums\ArticleType;
use App\Models\Post;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

/**
 * Contenido en disco (local) de los posts creados por el seeder.
 *
 * Usa como PLANTILLAS los contenidos que ya existen en disco (idénticos: content*.md + index*.json)
 * y los reescribe en las rutas de los posts nuevos:
 *   work   → blog/{user.uuid}/{post.code}/
 *   author → authors/{post.code}/
 *
 * Las carpetas antiguas se eliminan: tras un migrate:fresh pertenecen a usuarios y posts que ya no existen.
 * Si no hay plantillas en disco, usa las de la copia de seguridad (backups/pre-reseed_*).
 */
class ContentSeeder extends Seeder
{
    private const DISK = 'local';
    private const BLOG = 'blog';
    private const AUTHORS = 'authors';
    private const BACKUPS = 'backups';

    public function run(): void
    {
        $disk = Storage::disk(self::DISK);

        $blogTemplates = $this->templates($disk, self::BLOG, depth: 2);
        $authorTemplates = $this->templates($disk, self::AUTHORS, depth: 1);

        if ($blogTemplates->isEmpty() || $authorTemplates->isEmpty()) {
            $this->command?->warn('No hay plantillas de contenido en disco: los posts se quedan sin .md');
            return;
        }

        $disk->deleteDirectory(self::BLOG);
        $disk->deleteDirectory(self::AUTHORS);

        $i = 0;
        Post::ofArticleType(ArticleType::Work)->with('user')->orderBy('id')->each(function (Post $post) use ($disk, $blogTemplates, &$i) {
            $this->write($disk, $post->user->path($post->code), $blogTemplates[$i++ % $blogTemplates->count()]);
        });

        $j = 0;
        Post::ofArticleType(ArticleType::Author)->orderBy('id')->each(function (Post $post) use ($disk, $authorTemplates, &$j) {
            $this->write($disk, self::AUTHORS . "/{$post->code}/", $authorTemplates[$j++ % $authorTemplates->count()]);
        });

        $this->command?->info("Contenido: {$i} posts de works ({$blogTemplates->count()} plantillas) · {$j} de authors ({$authorTemplates->count()} plantillas)");
    }

    /**
     * Plantillas distintas (por contenido) de las carpetas de posts bajo $root.
     * Cada plantilla: [nombre_de_archivo => contenido], solo .md y .json.
     *
     * @return Collection<int, array<string, string>>
     */
    private function templates(Filesystem $disk, string $root, int $depth): Collection
    {
        $folders = $this->postFolders($disk, $root, $depth);

        // Sin contenido actual: recurre a la copia de seguridad más reciente
        if ($folders->isEmpty()) {
            $backup = collect($disk->directories(self::BACKUPS))
                ->filter(fn($d) => $disk->exists("{$d}/{$root}"))
                ->sort()
                ->last();

            $folders = $backup ? $this->postFolders($disk, "{$backup}/{$root}", $depth) : collect();
        }

        return $folders
            ->map(fn(string $folder) => collect($disk->files($folder))
                ->filter(fn($path) => str_ends_with($path, '.md') || str_ends_with($path, '.json'))
                ->mapWithKeys(fn($path) => [basename($path) => $disk->get($path)])
                ->sortKeys()
                ->all())
            ->filter(fn(array $files) => isset($files['content.md']))
            ->unique(fn(array $files) => md5(serialize($files)))
            ->values();
    }

    /** Carpetas de post: blog/{uuid}/{code} (depth 2) o authors/{code} (depth 1). */
    private function postFolders(Filesystem $disk, string $root, int $depth): Collection
    {
        $folders = collect($disk->directories($root));

        return $depth === 2
            ? $folders->flatMap(fn($d) => $disk->directories($d))
            : $folders;
    }

    private function write(Filesystem $disk, string $base, array $files): void
    {
        foreach ($files as $name => $content) {
            $disk->put(rtrim($base, '/') . "/{$name}", $content);
        }
    }
}
