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
        Schema::create('reports_post', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_report')->constrained('reports', 'id');
            $table->foreignId('id_post')->constrained('posts', 'id');

            $table->unique(["id_report", "id_post"]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports_post');
    }
};
