<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:editor'])->prefix('panel')->name('panel.')->group(function () {

    // Editores

    
    Route::middleware('role:admin')->group(function () {
       // Administradores
    });
});