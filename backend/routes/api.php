<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\TransactionController;
use Illuminate\Support\Facades\Route;

// ── Public routes (tidak perlu token) ─────────────────────
Route::post('/auth/register', [AuthController::class, 'register']); // ← tambah ini
Route::post('/auth/login',    [AuthController::class, 'login']);

// ── Protected routes (perlu token Sanctum) ─────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Profil
    Route::get('/profile',  [ProfileController::class, 'show']);
    Route::put('/profile',  [ProfileController::class, 'update']);

    // Transaksi (sesuaikan dengan controller yang sudah ada)
    Route::get('/transactions',         [TransactionController::class, 'index']);
    Route::post('/transactions',        [TransactionController::class, 'store']);
    Route::delete('/transactions',      [TransactionController::class, 'destroyAll']);
    Route::delete('/transactions/{id}', [TransactionController::class, 'destroy']);
});