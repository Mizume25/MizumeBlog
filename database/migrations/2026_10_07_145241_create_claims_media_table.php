<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('claims_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('claims_id')->constrained('claims')->cascadeOnDelete();
            $table->foreignId('media_id')->constrained('media')
                ->restrictOnDelete()->cascadeOnUpdate();
            $table->unique(['claims_id', 'media_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('claims_media');
    }
};