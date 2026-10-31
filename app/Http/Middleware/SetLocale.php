<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Aplica el idioma enviado por el cliente en la cookie 'lang'.
     * Si no llega o no está soportado, se queda el APP_LOCALE.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $lang = $request->cookie('lang');

        if (in_array($lang, config('app.available_locales'), true)) {
            App::setLocale($lang);
        }

        return $next($request);
    }
}
