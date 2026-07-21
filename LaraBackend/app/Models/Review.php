<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'product_id',
        'user_id',
        'rating',
        'comment',
        'is_approved',
    ];

    protected function casts(): array
    {
        return [
            'rating'      => 'integer',
            'is_approved' => 'boolean',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Full display name of the reviewer.
     */
    public function getReviewerNameAttribute(): string
    {
        if ($this->user) {
            return trim(($this->user->first_name ?? '') . ' ' . ($this->user->last_name ?? ''));
        }

        return 'Anonymous';
    }

    /**
     * Reviewer initials for avatar display.
     */
    public function getInitialsAttribute(): string
    {
        if ($this->user) {
            $f = strtoupper(substr($this->user->first_name ?? '', 0, 1));
            $l = strtoupper(substr($this->user->last_name ?? '', 0, 1));
            return $f . $l;
        }

        return 'AN';
    }
}
