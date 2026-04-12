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
        /* Entidad de Comentarios*/
        Schema::create('comentarios', function (Blueprint $table) {
            $table->id();
            $table->text('descripcion');

            /* Campos Foreing Key*/
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('post_id');

            //Definicion de user_id
            $table->foreign('user_id')
            ->references('id')
            ->on('users')
            ->onUpdate('cascade')
            ->onDelete('restrict');

            //Definicion de post_id
            $table->foreign('post_id')
            ->references('id')
            ->on('posts')
            ->onUpdate('cascade')
            ->onDelete('restrict');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comentarios');
    }
};
