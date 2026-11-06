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

        /** Un usuario solo puede tener un post por work: excluimos los works que ya usó */
        $usedWorksByUser = [];

        Post::all()->each(function (Post $post) use ($works, &$usedWorksByUser) {
            $used = $usedWorksByUser[$post->user_id] ?? [];
            $available = $works->whereNotIn('id', $used);

            if ($available->isEmpty()) return;

            $ids = $available->random(rand(1, min(3, $available->count())))->pluck('id');
            $post->works()->attach($ids);

            $usedWorksByUser[$post->user_id] = array_merge($used, $ids->all());
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
