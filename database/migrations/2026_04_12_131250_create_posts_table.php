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
        /*Tabla de Post*/
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('web_title')->nullable();
            $table->string('genero');
            $table->enum('categoria', ['Literatura', 'AnimeManga', 'Reflexiones']);
            $table->string('autor');
            $table->date('fecha_publicacion');
            $table->text('descripcion')->nullable();
            $table->boolean('destacado')->default(true);
            $table->string('portada')->nullable();
            $table->string('card')->nullable();
            $table->boolean('publicado')->default(false);
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
