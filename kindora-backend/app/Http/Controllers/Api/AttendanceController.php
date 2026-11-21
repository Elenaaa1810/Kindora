<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\CampaignRegistration;
use App\Notifications\MemberNotification;

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

   
public function update(Request $request, $registrationId)
{
    $request->validate([
        'status' => 'required|in:present,absent'
    ]);

    $registration = CampaignRegistration::findOrFail($registrationId);

    // Get the previous attendance status
    $previousStatus = $registration->attendance?->status;

    // Update attendance
    $attendance = Attendance::updateOrCreate(
        [
            'registration_id' => $registration->id
        ],
        [
            'status' => $request->status
        ]
    );

    // Notify member only when attendance becomes present
    if (
        $request->status === 'present' &&
        $previousStatus !== 'present'
    ) {
        $registration->loadMissing(['member', 'campaign']);

        $campaignName = $registration->campaign?->title
            ?? $registration->campaign?->name
            ?? 'your campaign';

        if ($registration->member) {
            $registration->member->notify(
                new MemberNotification([
                    'type' => 'attendance_present',
                    'title' => 'Attendance Confirmed!',
                    'message' => 'Your attendance for '
                        . $campaignName
                        . ' has been marked as Present.',
                    'campaign_id' => $registration->campaign_id,
                    'url' => '/campaigns'
                ])
            );
        }
    }

    return response()->json([
        'success' => true,
        'message' => 'Attendance updated successfully!',
        'data' => $attendance
    ]);
}

}