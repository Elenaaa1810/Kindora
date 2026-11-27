<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Member extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'members';

    protected $fillable = [
        'full_name',
        'email',
        'password',
        'phone',
        'location',
        'reason',
        'motivation',
        'interests',
        'previous_experience',
        'experience_details',
        'availability',
        'status',
        'rejection_reason',
    ];

    protected $hidden = [
        'password',
    ];

    // Include the name attribute when the member is converted to JSON.
    protected $appends = [
        'name',
    ];

    protected function casts(): array
    {
        return [
            'interests' => 'array',
            'previous_experience' => 'boolean',
        ];
    }

    // Use full_name as the name attribute for frontend compatibility.
    public function getNameAttribute()
    {
        return $this->full_name;
    }

    // ========================================
    // CAMPAIGN RELATIONSHIPS
    // ========================================

    public function campaignRegistrations()
    {
        return $this->hasMany(
            CampaignRegistration::class,
            'member_id'
        );
    }

    // ========================================
    // COMMUNITY RELATIONSHIPS
    // ========================================

    // Community posts created by this member.
    public function communityPosts()
    {
        return $this->hasMany(
            CommunityPost::class,
            'member_id'
        );
    }

    // Likes made by this member.
    public function communityLikes()
    {
        return $this->hasMany(
            CommunityPostLike::class,
            'member_id'
        );
    }

    // Posts saved by this member.
    public function communitySaves()
    {
        return $this->hasMany(
            CommunityPostSave::class,
            'member_id'
        );
    }

    // Comments written by this member.
    public function communityComments()
    {
        return $this->hasMany(
            CommunityComment::class,
            'member_id'
        );
    }
}
