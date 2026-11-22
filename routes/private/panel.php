<?php

use App\Http\Controllers\Admin\PanelController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:editor'])->prefix('panel')->name('panel.')->group(function () {


    /**
     * Linea de Trabajo de los usuarios editores y administradores
     *
     * /panel/workshop            → administrador  (panel/workshop/manage)
     * /panel/workshop/posts      → publicaciones  (panel/workshop/posts)
     * /panel/workshop/reports    → reportes       (panel/workshop/reports)
     * /panel/workshop/requests   → solicitudes    (panel/workshop/requests)
     *
     * Todas comparten el layout persistente WorkShopLayout en el frontend.
     */
    Route::prefix('workshop')->controller(PanelController::class)->name('workshop')->group(function () {
        Route::get('/', 'workshop');
        Route::get('/posts', 'posts')->name('.posts');
        Route::get('/reports', 'reports')->name('.reports');
        Route::get('/requests', 'requests')->name('.requests');
        Route::get('/media', 'media')->name('.media');
    });

    // Editores
     require __DIR__ . '/work.php';


    Route::middleware('role:admin')->group(function () {
       // Administradores
    });
});