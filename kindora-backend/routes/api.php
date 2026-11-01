
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MemberController;

Route::get('/hello', function () {
    return response()->json([
        'message' => 'Hello from Kindora Backend!'
    ]);
});

// Member registration
Route::post('/register', [MemberController::class, 'register']);

// Admin member approvals
Route::get('/admin/members', [MemberController::class, 'index']);
Route::patch('/admin/members/{member}/approve', [MemberController::class, 'approve']);
Route::patch('/admin/members/{member}/reject', [MemberController::class, 'reject']);
Route::post('/login', [MemberController::class, 'login']);
