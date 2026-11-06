<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class MemberController extends Controller
{
    // REGISTER A NEW VOLUNTEER
    public function register(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:members,email',
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

        $member = Member::create([
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
        ]);

        return response()->json([
            'message' => 'Your application has been submitted successfully!',
            'member' => $member,
        ], 201);
    }


    // GET ALL MEMBER APPLICATIONS
    public function index()
    {
        $members = Member::latest()->get();

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

        $member->update([
            'status' => 'Active',
            'rejection_reason' => null,
        ]);

        return response()->json([
            'message' => 'Application approved successfully.',
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

        $member->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        return response()->json([
            'message' => 'Application rejected successfully.',
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
}
