<?php

use App\Http\Controllers\Public\CommentsController;

/**
 * La lectura de comentarios ya no es un endpoint propio: es la página works.posts.comments
 * (WorkPostController@comments). Aquí solo quedan las escrituras, que responden con back()
 * para que Inertia vuelva a enviar la prop `comments` actualizada.
 */
Route::middleware(['auth', 'verified' , 'throttle:comments'])->group(function () {

    
    Route::post('/comentarios', [CommentsController::class, 'store'])->name('comments.store');
 
    Route::put('/comentarios/{id}', [CommentsController::class, 'update'])->name('comments.update');

    Route::delete('/comentarios/{id}', [CommentsController::class, 'destroy'])->name('comments.destroy');
    
    Route::delete('/comentarios/post/{post_id}', [CommentsController::class, 'destroyByPost'])->name('comments.destroyByPost');
   
    Route::delete('/comentarios', [CommentsController::class, 'deleteAll'])->name('comments.deleteAll');

    //Route::get('/post/{id}/pdf', [HomeController::class, 'pdf'])->name('post.pdf');

});


