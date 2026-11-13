<?php

use App\Http\Controllers\Admin\PanelController;
use App\Http\Controllers\Admin\WorkController;

Route::prefix('works')->controller(WorkController::class)->name('works.')->group(function () {
    //Route::get('/create', 'create')->name('create');
    //Route::post('/', 'store')->name('store');
    //Route::get('/{work}/edit', 'edit')->name('edit');
    //Route::put('/{work}', 'update')->name('update');
    //Route::delete('/{work}', 'destroy')->name('destroy');
});