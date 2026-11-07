<?php

Route::middleware(['auth', 'verified', 'throttle:comments'])->group(function () {


    //Route::get('/post/{id}/pdf', [HomeController::class, 'pdf'])->name('post.pdf');

});
