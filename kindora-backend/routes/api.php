
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\CampaignController;
use App\Http\Controllers\Api\CampaignRegistrationController;
use App\Http\Controllers\Api\AttendanceController;

// Test backend
Route::get('/hello', function () {
    return response()->json([
        'message' => 'Hello from Kindora Backend!'
    ]);
});

// ========================================
// PUBLIC ROUTES
// ========================================

// Admin login
Route::post('/admin/login', [AdminAuthController::class, 'login']);

// Member registration and login
Route::post('/register', [MemberController::class, 'register']);
Route::post('/login', [MemberController::class, 'login']);

// View campaigns
Route::get('/campaigns', [CampaignController::class, 'index']);
Route::get('/campaigns/{id}', [CampaignController::class, 'show']);


// ========================================
// MEMBER PROTECTED ROUTES
// ========================================

Route::middleware('auth:sanctum')->group(function () {

    // Member profile
    Route::get('/member/profile', [
        MemberController::class,
        'profile'
    ]);

    Route::put('/member/profile', [
        MemberController::class,
        'update'
    ]);

    // Join campaign
    Route::post('/campaigns/{campaign}/join', [
        CampaignRegistrationController::class,
        'join'
    ]);

    // Get campaigns joined by logged-in member
    Route::get('/my-campaigns', [
        CampaignRegistrationController::class,
        'myCampaigns'
    ]);

});



// ADMIN PROTECTED ROUTES


Route::middleware(['auth:sanctum', 'admin'])->group(function () {

    // Admin logout
    Route::post('/admin/logout', [
        AdminAuthController::class,
        'logout'
    ]);

    // Member management
    Route::get('/admin/members', [
        MemberController::class,
        'index'
    ]);

    Route::patch('/admin/members/{member}/approve', [
        MemberController::class,
        'approve'
    ]);

    Route::patch('/admin/members/{member}/reject', [
        MemberController::class,
        'reject'
    ]);

    Route::patch('/admin/members/{member}/status', [
        MemberController::class,
        'updateStatus'
    ]);

    // Campaign management
   
      Route::post('/admin/campaigns', [
        CampaignController::class,
        'store'
    ]);

    Route::put('/campaigns/{id}', [
        CampaignController::class,
        'update'
    ]);

    Route::delete('/campaigns/{id}', [
        CampaignController::class,
        'destroy'
    ]);

    Route::patch('/campaigns/{id}/complete', [
        CampaignController::class,
        'markCompleted'
    ]);

    // Attendance management
    Route::get('/campaigns/{campaignId}/attendance', [
        AttendanceController::class,
        'index'
    ]);

    Route::put('/attendance/{registrationId}', [
        AttendanceController::class,
        'update'
    ]);
    // Get all campaign registrations for admin notifications
Route::get('/admin/campaign-registrations', [
    CampaignRegistrationController::class,
    'adminRegistrations'
]);

});
