<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Post: aportación de un usuario (solo su autor lo edita).
 *
 * Un article pertenece a UN work o a UN author (columna directa, sin pivote):
 * - unique(user_id, work_id): un usuario escribe un solo post por work.
 * - unique(author_id): un author tiene un único artículo.
 * El resto de tipos (legality, community, policies) no apuntan a ninguno.
 * Un post sobre varios works sería otra entidad (implementación futura).
 */
return new class extends Migration
{
    private const TYPE_ALLOW = ['article', 'legality', 'community', 'policies'];

    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->json('title');                              // traducible: {"es": ..., "en": ...}
            $table->json('description')->nullable();            // traducible
            $table->string('code')->nullable()->unique();       // carpeta del contenido (.md) en disco
            $table->enum('type', self::TYPE_ALLOW)->default('community');
            $table->date('publish_date')->nullable()->index();  // null = borrador

            $table->foreignId('user_id')->constrained()->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('work_id')->nullable()->constrained()->restrictOnDelete();
            $table->foreignId('author_id')->nullable()->constrained()->restrictOnDelete();

            // Destacados: featured_by = user_id consume el cupo del autor; si lo pone un admin, no.
            $table->timestamp('featured_at')->nullable()->index();
            $table->foreignId('featured_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();

            $table->unique(['user_id', 'work_id']);             // los NULL no colisionan
            $table->unique('author_id');
        });

        // SQLite no admite ADD CONSTRAINT (tests en memoria).
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("
                ALTER TABLE posts ADD CONSTRAINT posts_article_target_check CHECK (
                    (type = 'article' AND ((work_id IS NULL) <> (author_id IS NULL)))
                    OR (type <> 'article' AND work_id IS NULL AND author_id IS NULL)
                )
            ");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
