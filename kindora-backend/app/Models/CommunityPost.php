<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityPost extends Model
{
    use HasFactory;

    protected $fillable = [
    'member_id',
    'description',
    'activity',
    'media_path',
    'media_type',
    'status',
];
    // The member who created the post
    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    // Likes belonging to this post
    public function likes()
    {
        return $this->hasMany(CommunityPostLike::class, 'post_id');
    }

    // Members who saved this post
    public function saves()
    {
        return $this->hasMany(CommunityPostSave::class, 'post_id');
    }

    // Comments belonging to this post
    public function comments()
    {
        return $this->hasMany(CommunityComment::class, 'post_id')
            ->whereNull('parent_comment_id');
    }
}