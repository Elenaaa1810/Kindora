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
    return $this->hasMany(CampaignRegistration::class);
}
}
