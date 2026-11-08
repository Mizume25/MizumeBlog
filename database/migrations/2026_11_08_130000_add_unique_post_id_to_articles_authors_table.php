<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Author ↔ Post es 1:1: un author tiene un único post y ese post no se comparte.
 * unique(author_id) ya existía; aquí se añade unique(post_id).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('articles_authors', function (Blueprint $table) {
            $table->unique('post_id');
        });
    }

    public function down(): void
    {
        Schema::table('articles_authors', function (Blueprint $table) {
            // La FK de post_id necesita un índice: se recrea el normal antes de quitar el único.
            $table->index('post_id', 'articles_authors_post_id_foreign');
            $table->dropUnique(['post_id']);
        });
    }
};
