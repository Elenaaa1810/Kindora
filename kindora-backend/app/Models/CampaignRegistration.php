<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CampaignRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'campaign_id',
        'status',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }
}