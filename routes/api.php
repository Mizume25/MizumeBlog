<?php

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/upcoming', [ApiController::class, 'upcoming'])->name('api.upcoming');


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/posts/{post_id}/comments', [ApiController::class, 'apiComments'])->name('apiComments');

    Route::get('/post/{post_id}/artwork/{artwork_id}', [ApiController::class, 'avaliable'])->name('avaliable');

    Route::put('/post/{post_id}/replace/{image_id}', [ApiController::class, 'replace'])->name('replace');
});

