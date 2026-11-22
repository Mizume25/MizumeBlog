<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Cola de revisión + historial de las fichas neutras (work, author, tag).
 *
 * Una sola tabla con dos papeles:
 * - status = pending  → propuesta en la cola de moderación
 * - status = approved → entrada del historial (quién, qué, cuándo, por qué)
 *
 * Solo se guarda el diff: { "sinopsi.en": { "old": ..., "new": ... }, "authors": { "old": [1,2], "new": [1,3] } }
 * Revertir = nueva revisión con el diff invertido (reverts_id); el historial nunca se borra.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('entity_revisions', function (Blueprint $table) {
            $table->id();
            $table->morphs('revisable');                                    // morphMap: work | author | tag
            $table->enum('action', ['create', 'update', 'delete', 'restore']);
            $table->json('changes');
            $table->text('reason')->nullable();                             // obligatorio para usuarios (validación)
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->enum('source', ['user', 'moderator', 'system'])->default('user');
            $table->json('flags')->nullable();                              // alertas de RevisionGuard

            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_note')->nullable();
            $table->foreignId('reverts_id')->nullable()->constrained('entity_revisions')->nullOnDelete();

            $table->timestamps();

            $table->index(['status', 'created_at']);                        // cola de moderación
            $table->index(['user_id', 'created_at']);                       // historial del usuario y ráfagas
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entity_revisions');
    }
};
