<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\IndexController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
Route::post('/comentarios/{id}', [HomeController::class, 'destroy'])->name('comments.destroy');


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
