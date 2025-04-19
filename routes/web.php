<?php

use Illuminate\Support\Facades\Route;
use MatematCmsfly\CmsflyFileManager\Controllers\FileManagerController;
use MatematCmsfly\CmsflyFileManager\Controllers\FmController;

Route::middleware('web')->group(function () {

    Route::controller(FileManagerController::class)->prefix('file-manager')->name('file-manager.')->group(function () {
        Route::get('/', 'index')->middleware(config('cmsfly-file-manager.routes.web.file-manager'))->name('index');
    });

    Route::prefix(config('file-manager.routePrefix'))->group(function(){
        Route::get('search',[FmController::class,'search'])->name('fm.search');
    });

});
