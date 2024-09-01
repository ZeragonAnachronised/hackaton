<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\MessageController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::post('login', [UserController::class, 'auth']);
Route::post('reg', [UserController::class, 'reg']);
Route::middleware(['cors'])->group(function () {
    Route::middleware('auth:sanctum')->group(function() {
        Route::get('/chat_get', [MessageController::class, 'get']);
        Route::post('/chat_send', [MessageController::class, 'send']);
        Route::post('/group_join', [GroupController::class, 'join']);
        Route::post('/group_invite', [GroupController::class, 'send']);
        Route::get('/logout', [UserController::class, 'logout']);
        Route::post('/invite', [GroupController::class, 'send']);
        Route::get('/check_invites', [GroupController::class, 'get']);
        Route::get('/user_info', [UserController::class, 'info']);
        Route::post('/ai', [MessageController::class, 'ai']);
    });
});