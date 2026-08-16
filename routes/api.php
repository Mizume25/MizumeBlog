<?php

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

/** Ruta Publica para obtener Imagenes de Footer */
Route::get('/upcoming', [ApiController::class, 'upcoming'])->name('api.upcoming');


/** Apis Publicas auntentificadas por usuario */
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/posts/{post_id}/comments', [ApiController::class, 'apiComments'])->name('apiComments');
});

/** Apis de Configuracion de Imagenes */
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/post/{post_id}/artwork/{artwork_id}', [ApiController::class, 'avaliable'])->name('avaliable');

    Route::put('/post/{post_id}/replace/{image_id}', [ApiController::class, 'replace'])->name('replace');
});
