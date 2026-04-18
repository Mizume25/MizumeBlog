<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GoogleController;

Route::middleware(['auth'])->group(function () {

    
    
});

//Renderizamos dashboard
Route::get('/', [HomeController::class, 'index'])->name('home');

//Renderizamos ruta dashboard
Route::get('dashboard',[HomeController::class , 'index'])->name('dashboard');

//Renderizamos post
Route::get('post/show/{id}',[HomeController::class, 'show'])->name('post.show');

//Funciones de contenido - Crear Comentario
Route::post('/comentarios', [HomeController::class, 'store'])->name('comments.store');

//Funciones de contenido - Eliminar Comentario 
Route::delete('/comentarios/{id}', [HomeController::class, 'destroy'])->name('comments.destroy');

//Api de google
Route::get('/auth/google', [GoogleController::class, 'redirect']);

Route::get('/auth/google/callback', [GoogleController::class, 'callback']);

//Ruta al panel principal
Route::get('post/MizumeAdmin', [AdminController::class , 'panel'])->name('post.panel');


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
