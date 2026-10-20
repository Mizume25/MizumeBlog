<?php
/**
 * Rutas Publicas de las entidades work
 */

use App\Http\Controllers\Public\WorkController;

Route::get('/works', [WorkController::class, 'index'])->name('works.index');

Route::get('/works/{work}', [WorkController::class, 'show'])->name('works.show');