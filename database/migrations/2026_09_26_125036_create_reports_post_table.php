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
            $table->foreignId('report_id')->constrained('reports', 'id');
            $table->foreignId('post_id')->constrained('posts', 'id');

            $table->unique(["report_id", "post_id"]);
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
