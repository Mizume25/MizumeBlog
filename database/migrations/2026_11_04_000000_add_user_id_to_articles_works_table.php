<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Un usuario solo puede escribir UN post por work.
 *
 * Se guarda el user_id del post dentro de la pivote para poder aplicar
 * unique(user_id, work_id). La FK compuesta (post_id, user_id) -> posts(id, user_id)
 * garantiza que ese user_id siempre sea el del dueño real del post.
 */
return new class extends Migration
{
    public function up(): void
    {
        /** Índice necesario para que la FK compuesta pueda referenciar (id, user_id) */
        Schema::table('posts', function (Blueprint $table) {
            $table->unique(['id', 'user_id'], 'posts_id_user_id_unique');
        });

        Schema::table('articles_works', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('post_id');
        });

        /** Rellenamos user_id con el dueño de cada post */
        DB::statement(
            'UPDATE articles_works SET user_id = (SELECT posts.user_id FROM posts WHERE posts.id = articles_works.post_id)'
        );

        /** Si ya existen duplicados, abortamos en vez de borrar datos en silencio */
        $duplicates = DB::table('articles_works')
            ->select('user_id', 'work_id', DB::raw('COUNT(*) as total'))
            ->groupBy('user_id', 'work_id')
            ->havingRaw('COUNT(*) > 1')
            ->get();

        if ($duplicates->isNotEmpty()) {
            $list = $duplicates
                ->map(fn ($d) => "user_id={$d->user_id} work_id={$d->work_id} ({$d->total} posts)")
                ->implode(', ');

            throw new RuntimeException(
                "Existen usuarios con más de un post sobre el mismo work: {$list}. "
                . 'Corrige esos registros (o ejecuta migrate:fresh --seed en desarrollo) y vuelve a migrar.'
            );
        }

        Schema::table('articles_works', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable(false)->change();

            $table->unique(['user_id', 'work_id'], 'articles_works_user_id_work_id_unique');

            $table->foreign(['post_id', 'user_id'], 'articles_works_post_user_foreign')
                ->references(['id', 'user_id'])
                ->on('posts')
                ->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::table('articles_works', function (Blueprint $table) {
            $table->dropForeign('articles_works_post_user_foreign');
            $table->dropUnique('articles_works_user_id_work_id_unique');
            $table->dropColumn('user_id');
        });

        Schema::table('posts', function (Blueprint $table) {
            $table->dropUnique('posts_id_user_id_unique');
        });
    }
};
