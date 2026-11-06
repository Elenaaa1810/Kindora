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
public function myCampaigns(Request $request)
{
    $member = $request->user();

    $campaignIds = CampaignRegistration::where('member_id', $member->id)
        ->pluck('campaign_id')
        ->map(fn ($id) => (int) $id)
        ->values();

    return response()->json([
        'campaign_ids' => $campaignIds,
    ]);
}
}
