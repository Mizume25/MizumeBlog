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
        Schema::dropIfExists('artwork_post');
        Schema::dropIfExists('post_images');
        Schema::dropIfExists('artwork_images');
        Schema::dropIfExists('artworks');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
