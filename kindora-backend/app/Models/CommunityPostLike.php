<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityPostLike extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'member_id',
    ];

    public function post()
    {
        return $this->belongsTo(CommunityPost::class, 'post_id');
    }

    public function member()
    {
        return $this->belongsTo(Member::class);
    }
}