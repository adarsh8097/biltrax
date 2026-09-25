<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        // 'laravelVersion' => Application::VERSION,
        // 'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/',function(){ return  Inertia::render('Welocme',
//  [])});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/admins', [AdminController::class, 'index'])->name('admin.index');
    Route::get('/admins/{admin}', [AdminController::class, 'show'])->name('admin.show');
    Route::post('/admins', [AdminController::class, 'store'])->name('admin.store');
    Route::put('/admins/{admin}', [AdminController::class, 'update'])->name('admin.update');
    Route::patch('/admins/{admin}/status', [AdminController::class, 'updateStatus'])->name('admin.status');
    Route::delete('/admins/{admin}', [AdminController::class, 'destroy'])->name('admin.destroy');

    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/trash', [UserController::class, 'trash'])->name('users.trash');
    Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::patch('/users/{user}/status', [UserController::class, 'updateStatus'])->name('users.status');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::post('/users/{id}/restore', [UserController::class, 'restore'])->name('users.restore');
    Route::delete('/users/{id}/force-delete', [UserController::class, 'forceDelete'])->name('users.force-delete');

    Route::get('/peers', [UserController::class, 'peers'])->name('peers.index');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::delete('/profile/self-delete', [ProfileController::class, 'selfDelete'])->name('profile.self-delete');
});

require __DIR__.'/auth.php';
