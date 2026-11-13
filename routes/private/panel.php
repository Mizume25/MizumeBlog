<?php

use App\Http\Controllers\Admin\PanelController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:editor'])->prefix('panel')->name('panel.')->group(function () {


    /** Linea de Trabajo de los usuarios editores y administradores */
    Route::get('/workshop', [PanelController::class, 'workshop'])->name('workshop');

    // Editores
     require __DIR__ . '/work.php';


    Route::middleware('role:admin')->group(function () {
       // Administradores
    });
});