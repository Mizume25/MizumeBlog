<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Un post de tipo article es de un work O de un author, nunca de ambos.
 *
 * - posts.article_type ('work' | 'author') es obligatorio en type = 'article' y nulo en el resto.
 * - Cada pivote lleva un article_type fijo (CHECK) y una FK compuesta
 *   (post_id, article_type) -> posts(id, article_type).
 *   Así MariaDB rechaza un post 'author' en articles_works y un post 'work' en articles_authors,
 *   y también impide cambiar el article_type de un post que ya está enlazado.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->enum('article_type', ['work', 'author'])->nullable()->after('type');
        });

        // Datos existentes: author si está en articles_authors, work para el resto de articles.
        DB::statement("UPDATE posts SET article_type = 'author'
            WHERE type = 'article' AND id IN (SELECT post_id FROM articles_authors)");
        DB::statement("UPDATE posts SET article_type = 'work'
            WHERE type = 'article' AND article_type IS NULL");

        DB::statement("ALTER TABLE posts ADD CONSTRAINT posts_article_type_check
            CHECK ((type = 'article') = (article_type IS NOT NULL))");

        Schema::table('posts', function (Blueprint $table) {
            $table->unique(['id', 'article_type'], 'posts_id_article_type_unique');
        });

        $this->addPivotConstraint('articles_works', 'work');
        $this->addPivotConstraint('articles_authors', 'author');
    }

    public function down(): void
    {
        $this->dropPivotConstraint('articles_authors');
        $this->dropPivotConstraint('articles_works');

        Schema::table('posts', function (Blueprint $table) {
            $table->dropUnique('posts_id_article_type_unique');
        });

        DB::statement('ALTER TABLE posts DROP CONSTRAINT posts_article_type_check');

        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('article_type');
        });
    }

    /** Si hay posts compartidos entre works y authors, la FK falla aquí: hay que limpiarlos antes. */
    private function addPivotConstraint(string $pivot, string $type): void
    {
        Schema::table($pivot, function (Blueprint $table) use ($type) {
            $table->enum('article_type', ['work', 'author'])->default($type)->after('post_id');
        });

        DB::statement("ALTER TABLE {$pivot} ADD CONSTRAINT {$pivot}_article_type_check
            CHECK (article_type = '{$type}')");

        Schema::table($pivot, function (Blueprint $table) use ($pivot) {
            $table->foreign(['post_id', 'article_type'], "{$pivot}_post_article_type_foreign")
                ->references(['id', 'article_type'])
                ->on('posts');
        });
    }

    private function dropPivotConstraint(string $pivot): void
    {
        Schema::table($pivot, function (Blueprint $table) use ($pivot) {
            $table->dropForeign("{$pivot}_post_article_type_foreign");
        });

        DB::statement("ALTER TABLE {$pivot} DROP CONSTRAINT {$pivot}_article_type_check");

        Schema::table($pivot, function (Blueprint $table) use ($pivot) {
            // La FK compuesta creó un índice (post_id, article_type) que queda huérfano.
            $table->dropIndex("{$pivot}_post_article_type_foreign");
            $table->dropColumn('article_type');
        });
    }
};
