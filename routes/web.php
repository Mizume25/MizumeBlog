<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ComentController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\PostImageConfigController;

/**
 * Rutas Restringidas par ausuarios verificados
 */
Route::middleware(['auth', 'verified'])->group(function () {

    //Funciones de contenido - Crear Comentario 
    Route::post('/comentarios', [ComentController::class, 'store'])->name('comments.store');

    //Funciones de contenido - Eliminar Comentario 
    Route::delete('/comentarios/{id?}/{post_id?}', [ComentController::class, 'destroy'])->name('comments.destroy');
});

/**
 * Rutas Restringidas para Admin
 */
Route::middleware(['auth', 'admin'])->group(function () {

    /** Views */

    /** Panel Princiap */
    Route::get('post/MizumeAdmin', [AdminController::class, 'panel'])->name('post.panel');

    /** Vista de edición */
    Route::get('post/edit/{id}', [AdminController::class, 'edit'])->name('post.edit');


    Route::get('post/create', [AdminController::class, 'create'])->name('post.create');


    /** Funciones */


    /** Function de Borrado */
    Route::delete('post/{id}', [AdminController::class, 'destroy'])->name('post.destroy');


    /** Funcion de borrador */
    Route::match('put', 'post/edit/{id}', [AdminController::class, 'update'])->name('post.update');


    /** Crear un post */
    Route::post('post/store', [AdminController::class, 'store'])->name('post.store');


    /** Crear Backup */
    Route::get('post/backup', [AdminController::class, 'backup'])->name('post.backup');



    // routes/web.php
    Route::get('/admin/posts/image-config', [PostImageConfigController::class, 'index'])->name('posts.image-config');

    Route::patch('/admin/posts/{post}/image-config', [PostImageConfigController::class, 'update'])->name('post.image-config.update');
});



// GUEST - ADMIN - USER

//Renderizamos dashboard - Redirreccion inicial
Route::get('/', [HomeController::class, 'index'])->name('home');

//Renderizamos ruta dashboard - Redireccion general 
Route::get('dashboard', [HomeController::class, 'index'])->name('dashboard');

//Renderizamos post - Renderizacion general
Route::get('post/show/{id}', [HomeController::class, 'show'])->name('post.show');


//Api de google - Login de Google
Route::get('/auth/google', [GoogleController::class, 'redirect']);

Route::get('/auth/google/callback', [GoogleController::class, 'callback']);

//Ruta para ir al archivador
Route::get('post/archivador', [HomeController::class, 'archivador'])->name('post.archivador');



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

