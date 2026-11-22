<?php

use App\Http\Controllers\Public\WorkPostController;

Route::middleware(['auth', 'verified', 'throttle:comments'])->group(function () {


    Route::get('/post/{id}/pdf', [WorkPostController::class, 'pdf'])->name('post.pdf');

});
