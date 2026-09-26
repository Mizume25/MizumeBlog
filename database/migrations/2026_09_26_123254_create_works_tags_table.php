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
        Schema::create('works_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tag_id')->constrained('tags', 'id');
            $table->foreignId('work_id')->constrained('works', 'id');
            $table->unique(['tag_id', 'work_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('works_tags');
    }
};
