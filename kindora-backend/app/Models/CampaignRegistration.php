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
    return $this->belongsTo(Member::class, 'member_id', 'id');
}

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public function attendance()
    {
        return $this->hasOne(Attendance::class, 'registration_id');
    }
}