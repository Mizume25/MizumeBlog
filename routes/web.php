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


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
