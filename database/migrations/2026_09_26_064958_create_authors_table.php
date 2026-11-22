<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Ficha neutra de un autor real. Toda propuesta de cambio pasa por revisión.
 * Cada create/update/delete queda registrado en entity_revisions.
 */
return new class extends Migration
{
    private const STATUS_ALLOW = ["pending", "verified"];

    public function up(): void
    {
        Schema::create('authors', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('pseudonym')->nullable();
            $table->string('slug')->unique();                   // desde display_name
            $table->smallInteger('birth_year')->nullable();     // con signo: admite años a.C. (AuthorFilterRequest: min -1000)
            $table->json('description');                        // traducible: {"es": ..., "en": ...}

            $table->enum('status', self::STATUS_ALLOW)->default('pending');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();
        });

        // Todo autor necesita al menos una identidad. SQLite no admite ADD CONSTRAINT (tests en memoria).
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("
                ALTER TABLE authors ADD CONSTRAINT authors_identity_check
                CHECK (name IS NOT NULL OR last_name IS NOT NULL OR pseudonym IS NOT NULL)
            ");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('authors');
    }
};
