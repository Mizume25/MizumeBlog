<?php

use App\Http\Controllers\Public\CommentsController;

/** Lectura de comentarios: fuera del throttle de escritura para poder refrescar tras cada acción */
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/comentarios/post/{post_id}', [CommentsController::class, 'index'])->name('comments.index');

});

Route::middleware(['auth', 'verified' , 'throttle:comments'])->group(function () {

    
    Route::post('/comentarios', [CommentsController::class, 'store'])->name('comments.store');
 
    Route::put('/comentarios/{id}', [CommentsController::class, 'update'])->name('comments.update');

    Route::delete('/comentarios/{id}', [CommentsController::class, 'destroy'])->name('comments.destroy');
    
    Route::delete('/comentarios/post/{post_id}', [CommentsController::class, 'destroyByPost'])->name('comments.destroyByPost');
   
    Route::delete('/comentarios', [CommentsController::class, 'deleteAll'])->name('comments.deleteAll');

    //Route::get('/post/{id}/pdf', [HomeController::class, 'pdf'])->name('post.pdf');

});


