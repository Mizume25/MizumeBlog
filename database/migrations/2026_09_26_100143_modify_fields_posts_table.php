<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
             /** Propiedades abandonadas */
            $table->dropColumn('cover');
            $table->dropColumn('cover_card');
            $table->dropColumn('web_title');
            $table->dropColumn('tags');
            $table->dropColumn('category');
            $table->dropColumn('author');
            $table->dropColumn('config');
            
            /** Nuevo Campos */
            $table->string('type');

            /** Campo Foregine key */
            $table->unsignedBigInteger('user_id');

            $table->foreign('user_id')
            ->references('id')
            ->on('users')
            ->onDelete('restrict')
            ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            //
        });
    }
};
