<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // Get notifications for logged-in member
    public function index(Request $request)
    {
        $member = $request->user();

        $notifications = $member->notifications()
            ->latest()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'unread_count' => $member->unreadNotifications()->count(),
            'data' => $notifications
        ]);
    }

    // Mark one notification as read
    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()
            ->notifications()
            ->where('id', $id)
            ->firstOrFail();

        $notification->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read.'
        ]);
    }

    // Mark all notifications as read
    public function markAllAsRead(Request $request)
    {
        $request->user()
            ->unreadNotifications()
            ->update(['read_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read.'
        ]);
    }

    // Delete one notification
    public function destroy(Request $request, $id)
    {
        $notification = $request->user()
            ->notifications()
            ->where('id', $id)
            ->firstOrFail();

        $notification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notification deleted.'
        ]);
    }
}
