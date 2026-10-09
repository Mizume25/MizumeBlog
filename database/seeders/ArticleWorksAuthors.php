<?php

namespace Database\Seeders;

use App\Enums\PostType;
use App\Models\Author;
use App\Models\Post;
use App\Models\Work;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ArticleWorksAuthors extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $works = Work::all();
        $authors = Author::all();

        Post::all()->each(function (Post $post) use ($works) {
            $post->works()->attach(
                $works->random(rand(1, min(3, $works->count())))->pluck('id')
            );
        });

        $usedAuthorIds = collect();

        Post::where('type', PostType::Article)->each(function (Post $post) use (&$usedAuthorIds) {
            $available = Author::whereNotIn('id', $usedAuthorIds)->inRandomOrder()->get();

            if ($available->isEmpty()) return;


            $chosen = $available->random(min(2, $available->count()));
            $post->authors()->attach($chosen->pluck('id'));

            $usedAuthorIds = $usedAuthorIds->merge($chosen->pluck('id'));
        });

        
    }
}
