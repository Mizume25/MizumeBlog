<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Ficha neutra de una obra (de la comunidad, nadie es su dueño).
 * Cada create/update/delete queda registrado en entity_revisions.
 */
return new class extends Migration
{
    private const MEDIUM_ALLOW = ["libro", "poema", "novela_ligera", "novela", "anime", "manga", "pelicula"];

    private const CATEGORY_ALLOW = ["literatura", "animemanga"];

    private const STATUS_ALLOW = ["pending", "verified"];

    public function up(): void
    {
        Schema::create('works', function (Blueprint $table) {
            $table->id();
            $table->json('title');                              // traducible: {"es": ..., "en": ...}
            $table->string('slug')->unique();                   // siempre desde title.es; clave de las rutas
            $table->string('abbreviation')->index();            // detección de duplicados
            $table->enum('category', self::CATEGORY_ALLOW);
            $table->enum('medium', self::MEDIUM_ALLOW);
            $table->date('publish_date');
            $table->json('sinopsi');                            // traducible

            // Flujo de fichas: pending → verified. created_by es atribución, no da permisos.
            $table->enum('status', self::STATUS_ALLOW)->default('pending');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();

            // Curación de la home (solo admin): null = no sale en la home
            $table->timestamp('home_at')->nullable();
            $table->unsignedSmallInteger('home_order')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['home_at', 'home_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('works');
    }
};
