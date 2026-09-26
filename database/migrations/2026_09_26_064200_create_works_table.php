<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration
{

    private const MEDIUM_ALLOW = ["libro", "poema", "novela_ligera", "novela", "anime", "manga" ,"pelicula"];
    private const CATEGORY_ALLOW = ["literatura", "animemanga"];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('works', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('abbreviation');
            $table->enum("category", self::CATEGORY_ALLOW);
            $table->date("publish_date");
            $table->text("sinopsi");
            $table->enum("medium", self::MEDIUM_ALLOW);
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
