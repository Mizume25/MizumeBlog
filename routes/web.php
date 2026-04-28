<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\Settings\ProfileController;

Route::middleware(['auth','verified'])->group(function () {
    
    //Funciones de contenido - Crear Comentario 
    Route::post('/comentarios', [HomeController::class, 'store'])->name('comments.store');

    //Funciones de contenido - Eliminar Comentario 
    Route::delete('/comentarios/{id}', [HomeController::class, 'destroy'])->name('comments.destroy'); 

    //Funcion de cotnenido - Eliminar Respuesta
    Route::delete('/respuestas/{id}', [HomeController::class, 'removeReply'])->name('reply.destroy');
});

Route::middleware(['auth', 'admin'])->group(function () {

    // ADMIN

    //Ruta al panel principal
    Route::get('post/MizumeAdmin', [AdminController::class , 'panel'])->name('post.panel');

    //Ruta a la edición de Post
    Route::get('post/edit/{id}', [AdminController::class , 'edit'])->name('post.edit');

    //Ruta de Actualizacion del post
    //Route::post('post/edit/{id}', [AdminController::class, 'update'])->name('post.update');

    //Ruta de destruccion
    Route::delete('post/{id}', [AdminController::class, 'destroy'])->name('post.destroy');

    //Ruta de la Edicion de Post
    Route::match(['post', 'put'], 'post/edit/{id}', [AdminController::class, 'update'])->name('post.update');

    //Ruta para ir al formulario de crear post
    Route::get('post/create',[AdminController::class , 'create'])->name('post.create');

    //Ruta para generar un post
    Route::post('post/store', [AdminController::class, 'store'])->name('post.store');

    //Ruta para generar un backup
    Route::get('post/backup',[AdminController::class, 'backup'])->name('post.backup');

    

});



// GUEST - ADMIN - USER

//Renderizamos dashboard - Redirreccion inicial
Route::get('/', [HomeController::class, 'index'])->name('home');

//Renderizamos ruta dashboard - Redireccion general 
Route::get('dashboard',[HomeController::class , 'index'])->name('dashboard');

//Renderizamos post - Renderizacion general
Route::get('post/show/{id}',[HomeController::class, 'show'])->name('post.show');


//Api de google - Login de Google
Route::get('/auth/google', [GoogleController::class, 'redirect']);

Route::get('/auth/google/callback', [GoogleController::class, 'callback']);

//Ruta para ir al archivador
Route::get('post/archivador',[HomeController::class, 'archivador'])->name('post.archivador');



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
