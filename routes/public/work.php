<?php
/**
 * Rutas Publicas de las entidades work
 *
 * /works/{work}                         → listado de posts (works/show/index)
 * /works/{work}/posts/{post}            → publicación     (works/show/post)
 * /works/{work}/posts/{post}/comments   → comentarios     (works/show/comments)
 * /works/{work}/posts/{post}/reports    → reportes        (works/show/reports)
 *
 * Todas comparten el layout persistente WorkShowLayout en el frontend.
 */

use App\Http\Controllers\Public\WorkPostController;
use Illuminate\Support\Facades\Route;

Route::prefix('/works/{work}/posts/{post}')->controller(WorkPostController::class)
    ->name('works.posts.')->group(function () {

        Route::get('/', 'show')->name('show');

        Route::get('/comments', 'comments')->name('comments');

        Route::get('/reports', 'reports')->name('reports');
    }
);
