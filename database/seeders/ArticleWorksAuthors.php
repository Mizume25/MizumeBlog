<?php

namespace Database\Seeders;

use App\Enums\ArticleType;
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

        Post::ofArticleType(ArticleType::Work)->each(function (Post $post) use ($works, &$usedWorksByUser) {
            $used = $usedWorksByUser[$post->user_id] ?? [];
            $available = $works->whereNotIn('id', $used);

            if ($available->isEmpty()) return;

            $ids = $available->random(rand(1, min(3, $available->count())))->pluck('id');
            $post->works()->attach($ids);

            $usedWorksByUser[$post->user_id] = array_merge($used, $ids->all());
        });

        /** Author ↔ Post es 1:1: un author por post y ningún author repetido */
        $usedAuthorIds = collect();

        Post::ofArticleType(ArticleType::Author)->each(function (Post $post) use (&$usedAuthorIds) {
            $author = Author::whereNotIn('id', $usedAuthorIds)->inRandomOrder()->first();

            if (! $author) return;

            $post->authors()->attach($author->id);

            $usedAuthorIds->push($author->id);
        });

        
    }
}
