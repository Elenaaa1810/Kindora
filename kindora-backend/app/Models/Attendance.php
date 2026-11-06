<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'registration_id',
        'status',
    ];

    public function registration()
    {
        return $this->belongsTo(
            CampaignRegistration::class,
            'registration_id'
        );
    }
}