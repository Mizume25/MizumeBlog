<?php

namespace Database\Seeders;

use App\Enums\ArticleType;
use App\Models\Author;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use App\Models\Work;
use Illuminate\Database\Seeder;

/**
 * Datos de prueba para la estructura actual.
 *
 * Orden: usuarios → fichas neutras (tags, authors, works) → posts → comentarios
 *        → pivotes (works_tags, works_authors) → contenido en disco → imágenes.
 *
 * Las fichas se crean sin usuario autenticado: cada alta queda en entity_revisions con source = system.
 */
class DatabaseSeeder extends Seeder
{
    private const EDITORS = 2;
    private const USERS = 10;
    private const TAGS = 10;
    private const AUTHORS = 10;
    private const WORKS = 10;

    /** Posts de works por editor (un post por work y usuario). */
    private const POSTS_PER_EDITOR = 5;

    /** Obras que el admin activa en la home. */
    private const HOME_WORKS = 4;

    private function createUsers(): void
    {
        User::factory()->admin()->create();
        User::factory(self::EDITORS)->editor()->create();
        User::factory(self::USERS)->create();
    }

    private function createTags(): void
    {
        Tag::factory(self::TAGS)->create();
    }

    /** 8 verificados con nombre y apellido, 2 pendientes conocidos solo por seudónimo. */
    private function createAuthors(): void
    {
        $creators = User::pluck('id');

        Author::factory(self::AUTHORS - 2)->verified()->create(['created_by' => fn() => $creators->random()]);
        Author::factory(2)->pseudonymous()->create(['created_by' => fn() => $creators->random()]);
    }

    /**
     * 7 verificadas y 3 pendientes ("ficha sin verificar"), una solo en castellano (fallback en inglés).
     * Las HOME_WORKS primeras verificadas salen en la home, en orden.
     */
    private function createWorks(): void
    {
        $creators = User::pluck('id');
        $createdBy = ['created_by' => fn() => $creators->random()];

        Work::factory(self::WORKS - 3)->verified()->create($createdBy);
        Work::factory(2)->create($createdBy);
        Work::factory()->untranslated()->create($createdBy);

        Work::verified()->orderBy('id')->take(self::HOME_WORKS)->get()
            ->each(fn(Work $work, int $i) => $work->showOnHome($i));
    }

    /**
     * Artículos de works: un usuario escribe como máximo un post por work (unique user_id + work_id).
     * Artículos de authors: un único artículo por author (unique author_id).
     * Cada editor destaca uno de sus posts publicados (cupo por defecto = 1) y deja uno en borrador.
     */
    private function createPosts(): void
    {
        $works = Work::all();

        foreach (User::editors()->get() as $editor) {
            $mine = $works->random(min(self::POSTS_PER_EDITOR, $works->count()));

            foreach ($mine as $i => $work) {
                $factory = Post::factory()->ownedBy($editor)->forWork($work);

                ($i === 0 ? $factory->draft() : $factory)->create();
            }

            $editor->posts()->publishPosts()->inRandomOrder()->first()?->feature($editor);
        }

        // Un destacado puesto por el admin: no consume el cupo del autor
        $admin = User::admins()->first();
        Post::ofArticleType(ArticleType::Work)->publishPosts()->whereNull('featured_at')
            ->inRandomOrder()->first()?->feature($admin);

        $editors = User::editors()->pluck('id');

        foreach (Author::all() as $author) {
            Post::factory()->forAuthor($author)->create(['user_id' => $editors->random()]);
        }
    }

    private function createComments(): void
    {
        Comment::factory(10)->create();
    }

    public function run(): void
    {
        $this->createUsers();
        $this->createTags();
        $this->createAuthors();
        $this->createWorks();
        $this->createPosts();
        $this->createComments();
        $this->command->info('Datos independientes creados');

        $this->call([
            WorksTagsSeeder::class,
            WorksAuthorsSeder::class,
            SitePagesSeeder::class, // community + legality (contenido ya en disco)
            ContentSeeder::class,   // .md + index.json en disco (antes que MediaSeeder)
            MediaSeeder::class,     // portadas de works, perfiles de authors y galería de posts
        ]);
    }
}
