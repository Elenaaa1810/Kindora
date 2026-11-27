<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\MemberApplicationStatusMail;

class MemberController extends Controller
{
    // REGISTER A NEW VOLUNTEER
    
// REGISTER A NEW VOLUNTEER OR REAPPLY AFTER REJECTION
public function register(Request $request)
{
    $validated = $request->validate([
        'full_name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'password' => 'required|string|min:8|confirmed',
        'phone' => 'nullable|string|max:30',
        'location' => 'nullable|string|max:255',
        'reason' => 'required|string',
        'motivation' => 'required|string',
        'interests' => 'required|array|min:1',
        'interests.*' => 'string',
        'previous_experience' => 'required|boolean',
        'experience_details' => 'nullable|string',
        'availability' => 'required|string|max:255',
    ]);

    // Check whether this email already belongs to a member
    $existingMember = Member::where('email', $validated['email'])->first();

    // Prevent duplicate applications from active members
    if ($existingMember && $existingMember->status === 'Active') {
        return response()->json([
            'message' => 'This email is already registered. Please log in.',
        ], 422);
    }

    // Prevent another application while the current one is pending
    if ($existingMember && $existingMember->status === 'pending') {
        return response()->json([
            'message' => 'Your application is already pending admin approval.',
        ], 422);
    }

    // Prevent suspended members from reapplying
    if ($existingMember && $existingMember->status === 'Suspended') {
        return response()->json([
            'message' => 'This account has been suspended. Please contact Kindora for assistance.',
        ], 403);
    }

    $memberData = [
        'full_name' => $validated['full_name'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
        'phone' => $validated['phone'] ?? null,
        'location' => $validated['location'] ?? null,
        'reason' => $validated['reason'],
        'motivation' => $validated['motivation'],
        'interests' => $validated['interests'],
        'previous_experience' => $validated['previous_experience'],
        'experience_details' => $validated['experience_details'] ?? null,
        'availability' => $validated['availability'],
        'status' => 'pending',
        'rejection_reason' => null,
    ];

    if ($existingMember && $existingMember->status === 'rejected') {

        // Update the existing rejected member's application
        $existingMember->update($memberData);

        // Remove old authentication tokens for security
        $existingMember->tokens()->delete();

        $member = $existingMember->fresh();

        $message = 'Your new application has been submitted successfully! Please wait for admin approval.';

    } else {

        // Create a completely new member
        $member = Member::create($memberData);

        $message = 'Your application has been submitted successfully! Please wait for admin approval.';
    }

    return response()->json([
        'message' => $message,
        'member' => $member,
    ], 201);
}



    // GET ALL MEMBER APPLICATIONS
    public function index()
    {
        $members = Member::withCount('campaignRegistrations')
            ->latest()
            ->get();

        return response()->json([
            'members' => $members,
        ]);
    }


    // APPROVE AN APPLICATION
    public function approve(Member $member)
    {
        if ($member->status !== 'pending') {
            return response()->json([
                'message' => 'This application has already been reviewed.',
            ], 422);
        }

        // Update member status
        $member->update([
            'status' => 'Active',
            'rejection_reason' => null,
        ]);

        // Send approval email
        $emailSent = true;

        try {
            Mail::to($member->email)->send(
                new MemberApplicationStatusMail(
                    $member->fresh(),
                    'approved'
                )
            );
        } catch (\Throwable $e) {
            $emailSent = false;

            \Log::error('Kindora approval email failed.', [
                'member_id' => $member->id,
                'email' => $member->email,
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'message' => $emailSent
                ? 'Application approved successfully. Approval email sent.'
                : 'Application approved successfully, but the notification email could not be sent.',

            'email_sent' => $emailSent,
            'member' => $member->fresh(),
        ]);
    }


    // REJECT AN APPLICATION
    public function reject(Request $request, Member $member)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:2000',
        ]);

        if ($member->status !== 'pending') {
            return response()->json([
                'message' => 'This application has already been reviewed.',
            ], 422);
        }

        // Update member status and rejection reason
        $member->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        // Send rejection email
        $emailSent = true;

        try {
            Mail::to($member->email)->send(
                new MemberApplicationStatusMail(
                    $member->fresh(),
                    'rejected',
                    $validated['rejection_reason']
                )
            );
        } catch (\Throwable $e) {
            $emailSent = false;

            \Log::error('Kindora rejection email failed.', [
                'member_id' => $member->id,
                'email' => $member->email,
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'message' => $emailSent
                ? 'Application rejected successfully. Rejection email sent.'
                : 'Application rejected successfully, but the notification email could not be sent.',

            'email_sent' => $emailSent,
            'member' => $member->fresh(),
        ]);
    }


    // MEMBER LOGIN
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // Find member by email
        $member = Member::where('email', $validated['email'])->first();

        // Check email and password
        if (!$member || !Hash::check($validated['password'], $member->password)) {
            return response()->json([
                'message' => 'Invalid email or password.',
            ], 401);
        }

        // Check application status
        if ($member->status === 'pending') {
            return response()->json([
                'message' => 'Your application is still waiting for admin approval.',
            ], 403);
        }

        if ($member->status === 'rejected') {
            return response()->json([
                'message' => 'Your application has been rejected. Please contact Kindora for more information.',
            ], 403);
        }

        if ($member->status === 'Suspended') {
            return response()->json([
                'message' => 'Your account has been suspended. Please contact Kindora for assistance.',
            ], 403);
        }

        if ($member->status !== 'Active') {
            return response()->json([
                'message' => 'Your account cannot access Kindora.',
            ], 403);
        }

        // Generate authentication token
        $token = $member->createToken('kindora-member')->plainTextToken;

        return response()->json([
            'message' => 'Login successful!',
            'token' => $token,
            'member' => $member,
        ]);
    }


    // GET LOGGED-IN MEMBER PROFILE
    public function profile(Request $request)
    {
        $member = $request->user();

        return response()->json([
            'message' => 'Profile retrieved successfully.',
            'member' => $member->makeHidden([
                'password',
                'remember_token',
            ]),
        ]);
    }


    // UPDATE MEMBER PROFILE
    public function update(Request $request)
    {
        $member = $request->user();

        $validated = $request->validate([
            'full_name' => 'required|string|max:255',

            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('members', 'email')->ignore($member->id),
            ],

            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
            'motivation' => 'nullable|string|max:1000',
        ]);

        $member->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully!',
            'member' => $member,
        ], 200);
    }


    // SUSPEND OR RESTORE A MEMBER ACCOUNT
    public function updateStatus(Request $request, Member $member)
    {
        $validated = $request->validate([
            'status' => [
                'required',
                Rule::in(['Active', 'Suspended']),
            ],
        ]);

        // Only approved members can be suspended or restored
        if (!in_array($member->status, ['Active', 'Suspended'])) {
            return response()->json([
                'message' => 'Only approved members can be suspended or restored.',
            ], 422);
        }

        $member->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => $validated['status'] === 'Suspended'
                ? 'Member account suspended successfully.'
                : 'Member account restored successfully.',

            'member' => $member->fresh(),
        ]);
    }
}
