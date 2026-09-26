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
        Schema::create('works_authors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_author')->constrained('authors', 'id');
            $table->foreignId('id_work')->constrained('works', 'id');
            $table->unique(['id_author', 'id_work']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('works_authors');
    }
};
