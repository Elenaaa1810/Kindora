<?php
use App\Http\Controllers\CampaignRegistrationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\CampaignController;

// Test backend
Route::get('/hello', function () {
    return response()->json([
        'message' => 'Hello from Kindora Backend!'
    ]);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::post(
        '/campaigns/{campaign}/join',
        [CampaignRegistrationController::class, 'join']
    );
});

// Member registration
Route::post('/register', [MemberController::class, 'register']);

// Admin member approvals
Route::get('/admin/members', [MemberController::class, 'index']);
Route::patch('/admin/members/{member}/approve', [MemberController::class, 'approve']);
Route::patch('/admin/members/{member}/reject', [MemberController::class, 'reject']);

Route::post('/login', [MemberController::class, 'login']);

// Campaign management
Route::get('/campaigns', [CampaignController::class, 'index']);
Route::post('/campaigns', [CampaignController::class, 'store']);
Route::get('/campaigns/{id}', [CampaignController::class, 'show']);
Route::put('/campaigns/{id}', [CampaignController::class, 'update']);
Route::delete('/campaigns/{id}', [CampaignController::class, 'destroy']);

// Mark campaign as completed
Route::patch('/campaigns/{id}/complete', [CampaignController::class, 'markCompleted']);