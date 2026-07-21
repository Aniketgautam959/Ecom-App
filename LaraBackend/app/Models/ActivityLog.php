<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    protected $fillable = [
        'causer_id',
        'action',
        'subject_type',
        'subject_id',
        'description',
    ];

    public function causer(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'causer_id');
    }
}
