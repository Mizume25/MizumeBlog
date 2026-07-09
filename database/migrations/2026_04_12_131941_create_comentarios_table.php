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
            $table->text('description');
            $table->date('publish_date');

            /**
             * Un Comentario es relativo a: 
             * - Usuario
             * - Post
             * - Y un Padre (único caso nullable)
             * 
             */
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('post_id');
            $table->unsignedBigInteger('parent_id')->nullable();

            
            $table->foreign('user_id')
            ->references('id')
            ->on('users')
            ->onUpdate('cascade')
            ->onDelete('restrict');

       
            $table->foreign('post_id')
            ->references('id')
            ->on('posts')
            ->onUpdate('cascade')
            ->onDelete('restrict');

          

            $table->foreign('parent_id')
            ->references('id')
            ->on('comentarios')
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
