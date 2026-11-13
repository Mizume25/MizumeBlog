<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Post → Work queda limitado a 1 work por post (decisión 2026-11-13).
 *
 * El pivote articles_works y la relación works() (BelongsToMany) se mantienen:
 * solo se añade unique(post_id). Así la URL /works/{work}/posts/{post} no es ambigua
 * y, si en el futuro se quiere N:N, basta con hacer rollback de esta migración
 * (y añadir un work principal, p. ej. is_primary en el pivote).
 */
return new class extends Migration
{
    public function up(): void
    {
        /** Si ya existen posts con varios works, abortamos en vez de borrar datos en silencio */
        $duplicates = DB::table('articles_works')
            ->select('post_id', DB::raw('COUNT(*) as total'))
            ->groupBy('post_id')
            ->havingRaw('COUNT(*) > 1')
            ->get();

        if ($duplicates->isNotEmpty()) {
            $list = $duplicates
                ->map(fn ($d) => "post_id={$d->post_id} ({$d->total} works)")
                ->implode(', ');

            throw new RuntimeException(
                "Existen posts con más de un work: {$list}. " .
                'Deja un solo work por post antes de aplicar esta migración.'
            );
        }

        Schema::table('articles_works', function (Blueprint $table) {
            $table->unique('post_id', 'articles_works_post_id_unique');
        });
    }

    public function down(): void
    {
        Schema::table('articles_works', function (Blueprint $table) {
            // La FK de post_id necesita un índice: se recrea el normal antes de quitar el único.
            $table->index('post_id', 'articles_works_post_id_foreign');
            $table->dropUnique('articles_works_post_id_unique');
        });
    }
};
