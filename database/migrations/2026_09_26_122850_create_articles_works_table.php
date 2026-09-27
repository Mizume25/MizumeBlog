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
        Schema::create('articles_works', function (Blueprint $table) {
            $table->id();
            #$table->foreignId('id_works')->constrained('works', 'id'); Correcion
            $table->foreignId('work_id')->constrained('works', 'id');
            
            $table->foreignId('post_id')->constrained('posts', 'id');

            $table->unique(['work_id', 'post_id']);
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
