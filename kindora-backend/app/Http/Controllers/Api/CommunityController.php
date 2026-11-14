<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\CommunityPost;
use App\Models\CommunityPostLike;
use App\Models\CommunityPostSave;
use App\Models\CommunityComment;

class CommunityController extends Controller
{
    // ========================================
    // GET APPROVED COMMUNITY POSTS
    // ========================================

    public function index(Request $request)
    {
        $member = $request->user();

        $posts = CommunityPost::with('member')
            ->withCount(['likes', 'comments'])
            ->where('status', 'approved')
            ->latest()
            ->paginate(10);

        $posts->getCollection()->transform(function ($post) use ($member) {
            return [
                'id' => $post->id,
                'description' => $post->description,
                'activity' => $post->activity,
                'media_path' => $post->media_path,

                'media_url' => $post->media_path
                    ? Storage::disk('public')->url($post->media_path)
                    : null,

                'media_type' => $post->media_type,
                'status' => $post->status,
                'created_at' => $post->created_at,

                'member' => [
                    'id' => $post->member?->id,
                    'name' => $post->member?->name
                        ?? $post->member?->full_name
                        ?? 'Member',
                ],

                'likes_count' => $post->likes_count,
                'comments_count' => $post->comments_count,

                'is_liked' => $member
                    ? $post->likes()
                        ->where('member_id', $member->id)
                        ->exists()
                    : false,

                'is_saved' => $member
                    ? $post->saves()
                        ->where('member_id', $member->id)
                        ->exists()
                    : false,
            ];
        });

        return response()->json($posts);
    }


    // ========================================
    // CREATE A COMMUNITY POST
    // ========================================

    public function store(Request $request)
    {
        $member = $request->user();

        // Only active members can submit posts.
        if (
            !$member ||
            strtolower((string) $member->status) !== 'active'
        ) {
            return response()->json([
                'message' => 'Only approved members can share community posts.'
            ], 403);
        }

        $validated = $request->validate([
            'description' => 'required|string|max:5000',
            'activity' => 'nullable|string|max:100',
            'media' => [
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,webp,mp4,mov,webm',
                'max:51200',
            ],
        ]);

        $mediaPath = null;
        $mediaType = null;

        if ($request->hasFile('media')) {
            $file = $request->file('media');

            $mediaType = str_starts_with($file->getMimeType(), 'image/')
                ? 'image'
                : 'video';

            $mediaPath = $file->store('community', 'public');
        }

        $post = CommunityPost::create([
            'member_id' => $member->id,
            'description' => $validated['description'],
            'activity' => $validated['activity'] ?? 'General Volunteering',
            'media_path' => $mediaPath,
            'media_type' => $mediaType,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Your post has been submitted and is waiting for admin approval.',
            'status' => $post->status,
        ], 201);
    }


    // ========================================
    // ADMIN: GET COMMUNITY POSTS
    // ========================================

    public function adminPosts(Request $request)
    {
        $validated = $request->validate([
            'status' => 'nullable|in:pending,approved,rejected',
        ]);

        $status = $validated['status'] ?? 'pending';

        $posts = CommunityPost::with('member')
            ->withCount(['likes', 'comments'])
            ->where('status', $status)
            ->latest()
            ->paginate(10);

        $posts->getCollection()->transform(function ($post) {
            return [
                'id' => $post->id,
                'description' => $post->description,
                'activity' => $post->activity,
                'media_path' => $post->media_path,

                'media_url' => $post->media_path
                    ? Storage::disk('public')->url($post->media_path)
                    : null,

                'media_type' => $post->media_type,
                'status' => $post->status,
                'created_at' => $post->created_at,

                'member' => [
                    'id' => $post->member?->id,
                    'name' => $post->member?->name
                        ?? $post->member?->full_name
                        ?? 'Member',
                ],

                'likes_count' => $post->likes_count,
                'comments_count' => $post->comments_count,
            ];
        });

        return response()->json($posts);
    }


    // ========================================
    // ADMIN: APPROVE OR REJECT A POST
    // ========================================

    public function updatePostStatus(Request $request, $postId)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        $post = CommunityPost::findOrFail($postId);

        $post->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => $validated['status'] === 'approved'
                ? 'Post approved successfully.'
                : 'Post rejected successfully.',

            'post' => [
                'id' => $post->id,
                'status' => $post->status,
            ],
        ]);
    }


    // ========================================
    // LIKE OR UNLIKE A POST
    // ========================================

    public function toggleLike(Request $request, $postId)
    {
        $member = $request->user();

        $post = CommunityPost::where('status', 'approved')
            ->findOrFail($postId);

        $like = CommunityPostLike::where('post_id', $post->id)
            ->where('member_id', $member->id)
            ->first();

        if ($like) {
            $like->delete();
            $liked = false;
            $message = 'Like removed.';
        } else {
            CommunityPostLike::create([
                'post_id' => $post->id,
                'member_id' => $member->id,
            ]);

            $liked = true;
            $message = 'Post liked.';
        }

        return response()->json([
            'message' => $message,
            'is_liked' => $liked,
            'likes_count' => $post->likes()->count(),
        ]);
    }


    // ========================================
    // SAVE OR UNSAVE A POST
    // ========================================

    public function toggleSave(Request $request, $postId)
    {
        $member = $request->user();

        $post = CommunityPost::where('status', 'approved')
            ->findOrFail($postId);

        $save = CommunityPostSave::where('post_id', $post->id)
            ->where('member_id', $member->id)
            ->first();

        if ($save) {
            $save->delete();
            $saved = false;
            $message = 'Post removed from saved posts.';
        } else {
            CommunityPostSave::create([
                'post_id' => $post->id,
                'member_id' => $member->id,
            ]);

            $saved = true;
            $message = 'Post saved successfully.';
        }

        return response()->json([
            'message' => $message,
            'is_saved' => $saved,
        ]);
    }


    // ========================================
    // ADD A COMMENT OR REPLY
    // ========================================

    public function addComment(Request $request, $postId)
    {
        $member = $request->user();

        $post = CommunityPost::where('status', 'approved')
            ->findOrFail($postId);

        $validated = $request->validate([
            'content' => 'required|string|max:2000',
            'parent_comment_id' => 'nullable|integer|exists:community_comments,id',
        ]);

        $parentId = $validated['parent_comment_id'] ?? null;

        if ($parentId) {
            $parent = CommunityComment::where('id', $parentId)
                ->where('post_id', $post->id)
                ->firstOrFail();

            if ($parent->parent_comment_id !== null) {
                return response()->json([
                    'message' => 'Replies to replies are not supported.',
                ], 422);
            }
        }

        $comment = CommunityComment::create([
            'post_id' => $post->id,
            'member_id' => $member->id,
            'parent_comment_id' => $parentId,
            'content' => $validated['content'],
        ]);

        $comment->load('member');

        return response()->json([
            'message' => $parentId
                ? 'Reply added successfully.'
                : 'Comment added successfully.',

            'comment' => [
                'id' => $comment->id,
                'content' => $comment->content,
                'parent_comment_id' => $comment->parent_comment_id,

                'member' => [
                    'id' => $comment->member->id,
                    'name' => $comment->member->name
                        ?? $comment->member->full_name
                        ?? 'Member',
                ],

                'created_at' => $comment->created_at,
            ],
        ], 201);
    }


    // ========================================
    // GET COMMENTS AND REPLIES FOR A POST
    // ========================================

    public function getComments($postId)
    {
        $post = CommunityPost::where('status', 'approved')
            ->findOrFail($postId);

        $comments = $post->comments()
            ->with(['member', 'replies.member'])
            ->latest()
            ->get();

        $comments->transform(function ($comment) {
            $formatMember = function ($member) {
                return [
                    'id' => $member?->id,
                    'name' => $member?->name
                        ?? $member?->full_name
                        ?? 'Member',
                ];
            };

            return [
                'id' => $comment->id,
                'content' => $comment->content,
                'member' => $formatMember($comment->member),
                'created_at' => $comment->created_at,

                'replies' => $comment->replies->map(function ($reply) use ($formatMember) {
                    return [
                        'id' => $reply->id,
                        'content' => $reply->content,
                        'member' => $formatMember($reply->member),
                        'parent_comment_id' => $reply->parent_comment_id,
                        'created_at' => $reply->created_at,
                    ];
                })->values(),
            ];
        });

        return response()->json([
            'comments' => $comments,
        ]);
    }


    // ========================================
    // GET POSTS SAVED BY THE LOGGED-IN MEMBER
    // ========================================

    public function savedPosts(Request $request)
    {
        $member = $request->user();

        $posts = CommunityPost::with('member')
            ->withCount(['likes', 'comments'])
            ->where('status', 'approved')
            ->whereHas('saves', function ($query) use ($member) {
                $query->where('member_id', $member->id);
            })
            ->latest()
            ->paginate(10);

        return response()->json($posts);
    }


    // ========================================
    // DELETE OWN POST
    // ========================================

    public function destroy(Request $request, $postId)
    {
        $member = $request->user();

        $post = CommunityPost::where('id', $postId)
            ->where('member_id', $member->id)
            ->firstOrFail();

        if ($post->media_path) {
            Storage::disk('public')->delete($post->media_path);
        }

        $post->delete();

        return response()->json([
            'message' => 'Post deleted successfully.',
        ]);
    }


    // ========================================
    // DELETE OWN COMMENT OR REPLY
    // ========================================

    public function destroyComment(Request $request, $commentId)
    {
        $member = $request->user();

        $comment = CommunityComment::where('id', $commentId)
            ->where('member_id', $member->id)
            ->firstOrFail();

        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted successfully.',
        ]);
    }


    // ========================================
    // GET POSTS CREATED BY THE LOGGED-IN MEMBER
    // ========================================

    public function myPosts(Request $request)
    {
        $member = $request->user();

        $posts = CommunityPost::with('member')
            ->withCount(['likes', 'comments'])
            ->where('member_id', $member->id)
            ->latest()
            ->paginate(5);

        $posts->getCollection()->transform(function ($post) use ($member) {
            return [
                'id' => $post->id,
                'description' => $post->description,
                'activity' => $post->activity,
                'media_path' => $post->media_path,

                'media_url' => $post->media_path
                    ? Storage::disk('public')->url($post->media_path)
                    : null,

                'media_type' => $post->media_type,
                'status' => $post->status,
                'created_at' => $post->created_at,

                'member' => [
                    'id' => $post->member?->id,
                    'name' => $post->member?->name
                        ?? $post->member?->full_name
                        ?? 'Member',
                ],

                'likes_count' => $post->likes_count,
                'comments_count' => $post->comments_count,

                'is_liked' => $post->likes()
                    ->where('member_id', $member->id)
                    ->exists(),

                'is_saved' => $post->saves()
                    ->where('member_id', $member->id)
                    ->exists(),
            ];
        });

        return response()->json($posts);
    }
}