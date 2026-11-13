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

        /**
         * Un post tiene un único work (unique(post_id) en articles_works)
         * y un usuario solo puede tener un post por work: excluimos los works que ya usó
         */
        $usedWorksByUser = [];

        Post::ofArticleType(ArticleType::Work)->each(function (Post $post) use ($works, &$usedWorksByUser) {
            $used = $usedWorksByUser[$post->user_id] ?? [];
            $available = $works->whereNotIn('id', $used);

            if ($available->isEmpty()) return;

            $id = $available->random()->id;
            $post->works()->attach($id);

            $usedWorksByUser[$post->user_id] = [...$used, $id];
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
