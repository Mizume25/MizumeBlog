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
            $table->date('fecha');
            /* Campos Foreing Key*/
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('post_id');
            $table->unsignedBigInteger('parent_id')->nullable();

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

            $table->foreign('parent_id')
            ->references('id')
            ->on('comentarios')
            ->onUpdate('cascade')
            ->onDelete('restrict');
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
