<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;



return new class extends Migration
{

    private const STATUS = ["denied", "accepted", "pending", "expired", "used"];
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        
        Schema::create('requests_permissions', function (Blueprint $table) {
            $table->id();
            $table->text("message");
            $table->enum('status', self::STATUS)->default('pending');
            $table->timestamp('granted_at')->nullable();
            $table->timestamp('access_expires_at')->nullable();
            $table->timestamp('requested_at')->nullable();
            $table->foreignId('granted_by')->nullable()->constrained('users');  // null hasta que se resuelve
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('post_id')->constrained('posts');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests_permissions');
    }
};
