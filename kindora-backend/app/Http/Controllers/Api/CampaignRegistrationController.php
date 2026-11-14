<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Campaign;
use App\Models\CampaignRegistration;


class CampaignRegistrationController extends Controller
{
    // MEMBER JOINS A CAMPAIGN
    public function join(Request $request, Campaign $campaign)
    {
        // Get the currently logged-in member from Sanctum
        $member = $request->user();

        // Check member account status
        if (!$member || $member->status !== 'Active') {
            return response()->json([
                'message' => 'Your account must be approved before joining campaigns.'
            ], 403);
        }

        // Only upcoming campaigns can be joined
        if (
            $campaign->status !== 'Upcoming' ||
            $campaign->date < now()->toDateString()
        ) {
            return response()->json([
                'message' => 'This campaign is no longer available for registration.'
            ], 400);
        }

        // Prevent duplicate registration
        $alreadyJoined = CampaignRegistration::where('member_id', $member->id)
            ->where('campaign_id', $campaign->id)
            ->exists();

        if ($alreadyJoined) {
            return response()->json([
                'message' => 'You have already joined this campaign.'
            ], 409);
        }

        // Count registered volunteers
        $registeredCount = CampaignRegistration::where('campaign_id', $campaign->id)
            ->whereIn('status', ['Pending', 'Approved'])
            ->count();

        // Check campaign capacity
        if ($registeredCount >= $campaign->capacity) {
            return response()->json([
                'message' => 'Sorry, this campaign is already full.'
            ], 400);
        }

        // Save registration immediately as Approved
        $registration = CampaignRegistration::create([
            'member_id' => $member->id,
            'campaign_id' => $campaign->id,
            'status' => 'Approved',
        ]);

        return response()->json([
            'message' => 'You have successfully joined the campaign!',
            'registration' => $registration,
            'volunteers' => $registeredCount + 1,
            'capacity' => $campaign->capacity,
        ], 201);
    }
    // GET CAMPAIGNS THE LOGGED-IN MEMBER HAS JOINED
// GET MEMBER'S JOINED AND COMPLETED CAMPAIGNS
public function myCampaigns(Request $request)
{
    $member = $request->user();

    $registrations = CampaignRegistration::with([
        'campaign',
        'attendance'
    ])
    ->where('member_id', $member->id)
    ->get();

    // JOINED CAMPAIGNS
    // Exclude campaigns where attendance is marked present.
    $joinedCampaigns = $registrations
        ->filter(function ($registration) {
            return $registration->attendance?->status !== 'present';
        })
        ->map(function ($registration) {
            $campaign = $registration->campaign;

            if (!$campaign) {
                return null;
            }

            return [
                'registration_id' => $registration->id,
                'campaign_id' => $campaign->id,
                'title' => $campaign->title,
                'category' => $campaign->category,
                'date' => $campaign->date,
                'time' => $campaign->time,
                'location' => $campaign->location,
                'description' => $campaign->description,
                'image_path' => $campaign->image_path,
                'registration_status' => $registration->status,
                'status' => 'Registered',
            ];
        })
        ->filter()
        ->values();

    // COMPLETED CAMPAIGNS
    // Only attendance marked present counts as completed.
    $completedCampaigns = $registrations
        ->filter(function ($registration) {
            return $registration->attendance?->status === 'present';
        })
        ->map(function ($registration) {
            $campaign = $registration->campaign;

            if (!$campaign) {
                return null;
            }

            return [
                'registration_id' => $registration->id,
                'campaign_id' => $campaign->id,
                'title' => $campaign->title,
                'category' => $campaign->category,
                'date' => $campaign->date,
                'time' => $campaign->time,
                'location' => $campaign->location,
                'description' => $campaign->description,
                'image_path' => $campaign->image_path,
                'registration_status' => $registration->status,
                'attendance_status' => 'present',
                'status' => 'Completed',
            ];
        })
        ->filter()
        ->values();

    return response()->json([
        'joined' => $joinedCampaigns,
        'completed' => $completedCampaigns,
    ]);
}
// GET ALL CAMPAIGN REGISTRATIONS FOR ADMIN NOTIFICATIONS
public function adminRegistrations()
{
    $registrations = CampaignRegistration::with([
        'member',
        'campaign'
    ])
    ->orderBy('created_at', 'desc')
    ->get();

    return response()->json([
        'success' => true,
        'registrations' => $registrations
    ]);
}
}
