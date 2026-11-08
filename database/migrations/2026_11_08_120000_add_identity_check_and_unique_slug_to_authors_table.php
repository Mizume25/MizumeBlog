<?php

use App\Models\Author;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Garantiza que todo autor tenga al menos una identidad (nombre, apellido o seudónimo)
     * y que su slug sea único.
     */
    public function up(): void
    {
        // Regenera los slugs existentes (antes se generaban desde una columna inexistente).
        Author::query()->each(function (Author $author) {
            $author->generateSlug();
            $author->saveQuietly();
        });

        DB::statement("
            ALTER TABLE authors ADD CONSTRAINT authors_identity_check
            CHECK (name IS NOT NULL OR last_name IS NOT NULL OR pseudonym IS NOT NULL)
        ");

        Schema::table('authors', function (Blueprint $table) {
            $table->unique('slug');
        });
    }

    public function down(): void
    {
        Schema::table('authors', function (Blueprint $table) {
            $table->dropUnique(['slug']);
        });

        DB::statement('ALTER TABLE authors DROP CHECK authors_identity_check');
    }
};
