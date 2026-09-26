<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('article_works', function (Blueprint $table) {
            $table->id();
            #$table->foreignId('id_works')->constrained('works', 'id'); Correcion
            $table->foreignId('id_work')->constrained('works', 'id');
            
            $table->foreignId('id_post')->constrained('posts', 'id');

            #$table->unique(['id_works', 'id_post']); Correcion
            $table->unique(['id_work', 'id_post']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('article_works');
    }
};
