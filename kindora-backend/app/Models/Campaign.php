<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasFactory;
    protected $appends = ['image_url'];

public function getImageUrlAttribute()
{
    return $this->image_path
        ? asset('storage/' . $this->image_path)
        : null;
}
public function campaignRegistrations()
{
    return $this->hasMany(CampaignRegistration::class);
}

    protected $fillable = [
        'title',
        'category',
        'date',
        'time',
        'location',
        'capacity',
        'description',
        'status',
        'image_path',
    ];
}