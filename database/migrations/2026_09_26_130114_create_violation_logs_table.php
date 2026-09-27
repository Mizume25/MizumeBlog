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
        Schema::create('violation_logs', function (Blueprint $table) {
            $table->id();
            $table->string('action');
            $table->integer('attempts_count');
            $table->unsignedBigInteger('post_id')->nullable();

            $table->foreign('post_id')
            ->references('id')
            ->on('posts')
            ->onDelete('restrict')
            ->onUpdate('cascade');

            $table->foreignId('user_id')->constrained('users', 'id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('violation_logs');
    }
};
