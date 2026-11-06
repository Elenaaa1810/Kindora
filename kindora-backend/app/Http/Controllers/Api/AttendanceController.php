<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\CampaignRegistration;

class AttendanceController extends Controller
{
    // Get all registered members and their attendance for a campaign
    public function index($campaignId)
    {
        $registrations = CampaignRegistration::with([
            'member',
            'attendance'
        ])
        ->where('campaign_id', $campaignId)
        ->get();

        return response()->json([
            'success' => true,
            'data' => $registrations
        ]);
    }

    // Mark a member as present or absent
    public function update(Request $request, $registrationId)
    {
        $request->validate([
            'status' => 'required|in:present,absent'
        ]);

        $registration = CampaignRegistration::findOrFail($registrationId);

        $attendance = Attendance::updateOrCreate(
            [
                'registration_id' => $registration->id
            ],
            [
                'status' => $request->status
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Attendance updated successfully!',
            'data' => $attendance
        ]);
    }
}