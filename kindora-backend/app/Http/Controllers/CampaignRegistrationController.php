<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Campaign;
use App\Models\CampaignRegistration;

class CampaignRegistrationController extends Controller
{
    public function join(Request $request, Campaign $campaign)
    {
        // Get the currently logged-in member from Sanctum
        $member = $request->user();

        // Only approved members can join
        if ($member->status !== 'Active') {
            return response()->json([
                'message' => 'Your account must be approved before joining campaigns.'
            ], 403);
        }

        // Only upcoming campaigns can be joined
        if ($campaign->status !== 'Upcoming' || $campaign->date < now()->toDateString()) {
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

        // Check campaign capacity
        $registeredCount = CampaignRegistration::where('campaign_id', $campaign->id)
            ->whereIn('status', ['Pending', 'Approved'])
            ->count();

        if ($registeredCount >= $campaign->capacity) {
            return response()->json([
                'message' => 'Sorry, this campaign is already full.'
            ], 400);
        }

        // Save registration
        $registration = CampaignRegistration::create([
            'member_id' => $member->id,
            'campaign_id' => $campaign->id,
            'status' => 'Pending',
        ]);

        return response()->json([
            'message' => 'You have successfully joined the campaign!',
            'registration' => $registration
        ], 201);
    }
}