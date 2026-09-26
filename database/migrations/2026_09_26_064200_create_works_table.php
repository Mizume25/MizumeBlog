<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/** Medios Permitidos */
const MEDIUM_ALLOW = ["libro", "poema", "novela_ligera", "novela", "anime", "manga" ,"pelicula"];

/** Categorias Permitidas */
const CATEGORY_ALLOW = ["literatura", "animemanga"];

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('works', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('abbreviation');
            $table->enum("category", CATEGORY_ALLOW);
            $table->date("publish_date");
            $table->text("sinopsi");
            $table->enum("medium", MEDIUM_ALLOW);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('works');
    }
};
