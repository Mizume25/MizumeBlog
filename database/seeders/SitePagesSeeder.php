<?php

namespace Database\Seeders;

use App\Enums\PostType;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Páginas fijas del sitio: community y las 4 legales (footer, prop compartida `terms`).
 *
 * El contenido NO se genera: ya vive en disco y MarkdownService lo lee por `code`.
 *   community → storage/app/private/community/Mizumeblog{,_en}.md
 *   legality  → storage/app/private/legality/{code}/content{,_en}.md
 *
 * Idempotente (firstOrNew por code): se puede relanzar sin duplicar.
 * Los code de legality deben coincidir con el whereIn de la ruta legality.show.
 */
class SitePagesSeeder extends Seeder
{
    private const PAGES = [
        [
            'type' => PostType::Community,
            'code' => 'community',
            'title' => ['es' => 'MizumeBlog', 'en' => 'MizumeBlog'],
            'description' => [
                'es' => 'Historia y propósito de la comunidad MizumeBlog',
                'en' => 'History and purpose of the MizumeBlog community',
            ],
        ],
        [
            'type' => PostType::Legality,
            'code' => 'aviso-legal',
            'title' => ['es' => 'Aviso legal', 'en' => 'Legal Notice'],
        ],
        [
            'type' => PostType::Legality,
            'code' => 'cookies',
            'title' => ['es' => 'Política de cookies', 'en' => 'Cookie Policy'],
        ],
        [
            'type' => PostType::Legality,
            'code' => 'politica-privacidad',
            'title' => ['es' => 'Política de privacidad', 'en' => 'Privacy Policy'],
        ],
        [
            'type' => PostType::Legality,
            'code' => 'terminos-condiciones',
            'title' => ['es' => 'Términos y condiciones de uso', 'en' => 'Terms and Conditions of Use'],
        ],
    ];

    public function run(): void
    {
        $admin = User::admins()->first();

        if (! $admin) {
            $this->command?->warn('SitePagesSeeder: no hay admin, páginas del sitio omitidas');
            return;
        }

        foreach (self::PAGES as $page) {
            $post = Post::firstOrNew(['code' => $page['code']]);

            $post->type = $page['type'];
            $post->user_id = $admin->id;
            $post->publish_date ??= now();
            $post->setTranslations('title', $page['title']);

            if (isset($page['description'])) {
                $post->setTranslations('description', $page['description']);
            }

            $post->save();
        }

        Post::forgetLegalityCache();

        $this->command?->info('Páginas del sitio creadas (community + legality)');
    }
}
