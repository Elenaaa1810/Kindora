<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'member_id',
        'parent_comment_id',
        'content',
    ];

    // The post containing this comment
    public function post()
    {
        return $this->belongsTo(CommunityPost::class, 'post_id');
    }

    // The member who wrote the comment
    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    // Parent comment (if this is a reply)
    public function parent()
    {
        return $this->belongsTo(
            CommunityComment::class,
            'parent_comment_id'
        );
    }

    // Replies to this comment
    public function replies()
    {
        return $this->hasMany(
            CommunityComment::class,
            'parent_comment_id'
        )->with('member');
    }
}