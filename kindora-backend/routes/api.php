
<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\CampaignController;
use App\Http\Controllers\Api\CampaignRegistrationController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\CommunityController;


// ========================================
// TEST BACKEND
// ========================================

Route::get('/hello', function () {
    return response()->json([
        'message' => 'Hello from Kindora Backend!'
    ]);
});


// ========================================
// PUBLIC ROUTES
// ========================================

// Admin login
Route::post('/admin/login', [
    AdminAuthController::class,
    'login'
]);

// Member registration and login
Route::post('/register', [
    MemberController::class,
    'register'
]);

Route::post('/login', [
    MemberController::class,
    'login'
]);

// View campaigns
Route::get('/campaigns', [
    CampaignController::class,
    'index'
]);

Route::get('/campaigns/{id}', [
    CampaignController::class,
    'show'
]);


// ========================================
// PUBLIC COMMUNITY ROUTES
// ========================================

// Guests and logged-in members can view community posts.
Route::get('/community/posts', [
    CommunityController::class,
    'index'
]);


// ========================================
// MEMBER PROTECTED ROUTES
// ========================================

Route::middleware('auth:sanctum')->group(function () {

    // ------------------------------------
    // MEMBER PROFILE
    // ------------------------------------

    Route::get('/member/profile', [
        MemberController::class,
        'profile'
    ]);

    Route::put('/member/profile', [
        MemberController::class,
        'update'
    ]);


    // ------------------------------------
    // CAMPAIGN REGISTRATION
    // ------------------------------------

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


    // ------------------------------------
    // COMMUNITY POSTS
    // ------------------------------------

    // Create a post
    Route::post('/community/posts', [
        CommunityController::class,
        'store'
    ]);

    // Like or unlike a post
    Route::post('/community/posts/{postId}/like', [
        CommunityController::class,
        'toggleLike'
    ]);

    // Save or unsave a post
    Route::post('/community/posts/{postId}/save', [
        CommunityController::class,
        'toggleSave'
    ]);

    // View comments and replies
    Route::get('/community/posts/{postId}/comments', [
        CommunityController::class,
        'getComments'
    ]);

    // Add a comment or reply
    Route::post('/community/posts/{postId}/comments', [
        CommunityController::class,
        'addComment'
    ]);

    // Delete your own post
    Route::delete('/community/posts/{postId}', [
        CommunityController::class,
        'destroy'
    ]);

    // Delete your own comment or reply
    Route::delete('/community/comments/{commentId}', [
        CommunityController::class,
        'destroyComment'
    ]);

    // View saved posts
    Route::get('/community/saved-posts', [
        CommunityController::class,
        'savedPosts'
    ]);

    // View posts created by logged-in member
    Route::get('/community/my-posts', [
        CommunityController::class,
        'myPosts'
    ]);

});


// ========================================
// ADMIN PROTECTED ROUTES
// ========================================

Route::middleware(['auth:sanctum', 'admin'])->group(function () {

    // ------------------------------------
    // ADMIN LOGOUT
    // ------------------------------------

    Route::post('/admin/logout', [
        AdminAuthController::class,
        'logout'
    ]);


    // ------------------------------------
    // MEMBER MANAGEMENT
    // ------------------------------------

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


    // ------------------------------------
    // CAMPAIGN MANAGEMENT
    // ------------------------------------

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


    // ------------------------------------
    // ATTENDANCE MANAGEMENT
    // ------------------------------------

    Route::get('/campaigns/{campaignId}/attendance', [
        AttendanceController::class,
        'index'
    ]);

    Route::put('/attendance/{registrationId}', [
        AttendanceController::class,
        'update'
    ]);
    // Community Post Management
Route::get('/admin/community-posts', [
    CommunityController::class,
    'adminPosts'
]);

Route::patch('/admin/community-posts/{postId}/status', [
    CommunityController::class,
    'updatePostStatus'
]);


    // ------------------------------------
    // ADMIN CAMPAIGN REGISTRATIONS
    // ------------------------------------

    Route::get('/admin/campaign-registrations', [
        CampaignRegistrationController::class,
        'adminRegistrations'
    ]);

});
