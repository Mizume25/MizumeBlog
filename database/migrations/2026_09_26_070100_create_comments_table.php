<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Comentarios de un post. Un comentario pertenece a un usuario y a un post,
 * y puede responder a otro comentario (parent_id, único campo nullable).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->text('description');
            $table->date('publish_date')->default(DB::raw('CURRENT_DATE'));

            $table->foreignId('user_id')->constrained()->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('post_id')->constrained()->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('parent_id')->nullable()->constrained('comments')->restrictOnDelete()->cascadeOnUpdate();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
