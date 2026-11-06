<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Campaign;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class CampaignController extends Controller
{
    // Automatically update expired campaigns
    private function updateExpiredCampaigns()
    {
        $campaigns = Campaign::where('status', 'Upcoming')->get();

        foreach ($campaigns as $campaign) {
            $campaignDateTime = Carbon::parse(
                $campaign->date . ' ' . $campaign->time
            );

            if (now()->greaterThanOrEqualTo($campaignDateTime)) {
                $campaign->update([
                    'status' => 'Completed'
                ]);
            }
        }
    }

    // Get all campaigns
    public function index()
    {
        $this->updateExpiredCampaigns();

        $campaigns = Campaign::withCount([
            'campaignRegistrations as volunteers' => function ($query) {
                $query->whereIn('status', ['Pending', 'Approved']);
            }
        ])
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json($campaigns);
    }

    // Create a new campaign
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'category' => 'required|in:Environment,Donation,Education,Community',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'location' => 'required|string|max:150',
            'capacity' => 'required|integer|min:1|max:10000',
            'description' => 'required|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        // Upload campaign image
        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')
                ->store('campaigns', 'public');
        }

        // Remove the uploaded file from the data array
        unset($validated['image']);

        $campaign = Campaign::create($validated);

        // Check whether the new campaign has already expired
        $this->updateExpiredCampaigns();

        $campaign->refresh();

        return response()->json([
            'message' => 'Campaign created successfully!',
            'campaign' => $campaign
        ], 201);
    }

    // Get one campaign
    public function show($id)
    {
        $this->updateExpiredCampaigns();

        $campaign = Campaign::withCount([
            'campaignRegistrations as volunteers' => function ($query) {
                $query->whereIn('status', ['Pending', 'Approved']);
            }
        ])->findOrFail($id);

        return response()->json($campaign);
    }

    // Update a campaign
    public function update(Request $request, $id)
    {
        $campaign = Campaign::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:100',
            'category' => 'sometimes|required|in:Environment,Donation,Education,Community',
            'date' => 'sometimes|required|date',
            'time' => 'sometimes|required|date_format:H:i',
            'location' => 'sometimes|required|string|max:150',
            'capacity' => 'sometimes|required|integer|min:1|max:10000',
            'description' => 'sometimes|required|string|max:1000',
            'status' => 'sometimes|required|in:Upcoming,Completed',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        // Replace the old campaign image if a new image is uploaded
        if ($request->hasFile('image')) {

            // Delete the previous image
            if ($campaign->image_path) {
                Storage::disk('public')->delete($campaign->image_path);
            }

            // Store the new image
            $validated['image_path'] = $request->file('image')
                ->store('campaigns', 'public');
        }

        // Remove the uploaded file from the update data
        unset($validated['image']);

        $campaign->update($validated);

        $this->updateExpiredCampaigns();

        $campaign->refresh();

        return response()->json([
            'message' => 'Campaign updated successfully!',
            'campaign' => $campaign
        ]);
    }

    // Delete a campaign
    public function destroy($id)
    {
        $campaign = Campaign::findOrFail($id);

        // Delete the campaign image from storage
        if ($campaign->image_path) {
            Storage::disk('public')->delete($campaign->image_path);
        }

        // Delete the campaign from database
        $campaign->delete();

        return response()->json([
            'message' => 'Campaign deleted successfully!'
        ]);
    }

    // Mark campaign as completed manually
    public function markCompleted($id)
    {
        $campaign = Campaign::findOrFail($id);

        $campaign->update([
            'status' => 'Completed'
        ]);

        return response()->json([
            'message' => 'Campaign marked as completed!',
            'campaign' => $campaign
        ]);
    }
}
