<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /*
     * Tabla migracion de post
     */
    public function up(): void
    {   
        /*Tabla de Post*/
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('web_title');
            $table->string('tags');
            $table->enum('category', ['literatura', 'animemanga', 'reflexiones']);
            $table->string('author');
            $table->date('publish_date')->nullable();
            $table->text('description')->nullable();
            $table->boolean('featured')->default(true);
            $table->string('cover')->nullable();
            $table->string('cover_card')->nullable();
            $table->json('config')->nullable();
            $table->timestamps();
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
