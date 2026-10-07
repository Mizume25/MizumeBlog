<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('claims', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->json('social_proof_url');
            $table->enum('status', ['pending_verification', 'under_review', 'approved', 'rejected'])
                ->default('pending_verification');
            $table->text('message');
            $table->string('verification_token', 64)->nullable()->unique();
            $table->timestamp('verification_token_expires_at')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->text('resolution_notes')->nullable();
            $table->foreignId('reviewed_by')->nullable()
                ->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('user_id')->nullable()
                ->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('claims');
    }
};