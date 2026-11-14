<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Member extends Authenticatable
{
    use HasApiTokens;
  

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

    protected function casts(): array
    {
        return [
            'interests' => 'array',
            'previous_experience' => 'boolean',
        ];
    }

public function campaignRegistrations()
{
    return $this->hasMany(
        \App\Models\CampaignRegistration::class,
        'member_id'
    );
}
// Community posts created by this member
public function communityPosts()
{
    return $this->hasMany(CommunityPost::class);
}

// Likes made by this member
public function communityLikes()
{
    return $this->hasMany(CommunityPostLike::class);
}

// Posts saved by this member
public function communitySaves()
{
    return $this->hasMany(CommunityPostSave::class);
}

// Comments written by this member
public function communityComments()
{
    return $this->hasMany(CommunityComment::class);
}
}
