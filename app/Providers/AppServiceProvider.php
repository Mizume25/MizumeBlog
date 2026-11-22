<?php

namespace App\Providers;

use App\Models\Author;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use App\Models\Work;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\ServiceProvider;
use Spatie\Translatable\Facades\Translatable;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        /**
         * Nombres cortos en las columnas polimórficas (media.model_type, entity_revisions.revisable_type,
         * personal_access_tokens.tokenable_type): no se guarda el nombre de la clase PHP.
         * enforce: un modelo sin alias en una relación polimórfica lanza excepción en vez de guardar la clase.
         */
        Relation::enforceMorphMap([
            'user'   => User::class,
            'post'   => Post::class,
            'work'   => Work::class,
            'author' => Author::class,
            'tag'    => Tag::class,
        ]);

        /**
         * Campos traducibles: si falta el idioma pedido se usa el castellano y, si tampoco existe,
         * cualquier idioma disponible. No se toca app.fallback_locale ('en'), que usan los ficheros de lang/.
         */
        Translatable::fallback(fallbackLocale: 'es', fallbackAny: true);
    }
}
