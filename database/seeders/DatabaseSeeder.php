<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Author;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use App\Models\Work;
use App\Models\Comment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class DatabaseSeeder extends Seeder
{
    private function createUsers(): void
    {
        User::factory()->admin()->create();
        User::factory(2)->editor()->create();
        User::factory(10)->create();
    }

    private function createTags(): void
    {
        Tag::factory(10)->create();
    }


    private function createAuthors(): void
    {
        Author::factory(10)->create();
    }

    private function createWorks(): void
    {
        Work::factory(10)->create();
    }

    private function createPosts(): void
    {
        Post::factory(10)->create();
    }

    private function createComments(): void
    {
        Comment::factory(10)->create();
    }

    private function makefaker(): void
    {
        $users = User::where(function ($query) {
            $query->where('role', UserRole::Admin)
                ->orWhere('role', UserRole::Editor);
        })->whereHas('posts')->get();

        foreach ($users as $user) Storage::disk('local')->makeDirectory('blog/' . $user->uuid);
        
    }


    private function main()
    {
        $this->createUsers();
        $this->createTags();
        $this->createAuthors();
        $this->createWorks();
        $this->createPosts();
        $this->createComments();
        $this->makefaker();
    }

    public function run(): void
    {
        $this->main();
        $this->command->info("Datos independientes creados");
        $this->call([
            WorksTagsSeeder::class,
            WorksAuthorsSeder::class,
            ArticleWorksAuthors::class,

        ]);
    }
}
