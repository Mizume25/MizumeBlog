<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

const STATUS = ["denied", "accepted", "pending", "expired", "used"];

return new class extends Migration
{


    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('requests_permissions', function (Blueprint $table) {
            $table->id();
            $table->text("message");
            $table->enum("status", STATUS);
            $table->timestamps('granted_at')->nullable();
            $table->timestamp('access_expires_at')->nullable();
            $table->timestamp('requested_at')->nullable(); 
            $table->foreignId('granted_by')->constrained('users', 'id');
            $table->foreignId('user_id')->constrained('users', 'id');
            $table->foreignId('id_post')->constrained('posts', 'id');
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
