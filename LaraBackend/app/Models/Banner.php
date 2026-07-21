<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Banner extends Model
{
    protected $fillable = [
        'title',
        'subtitle',
        'image',
        'link',
        'button_text',
        'position',
        'sort_order',
        'status',
    ];

    protected $appends = ['image_url'];

    protected function casts(): array
    {
        return [
            'status' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /**
     * Publicly accessible URL for the banner image.
     *
     * Handles both externally hosted images (full URLs) and files uploaded
     * through the admin panel (stored on the public disk). Returns a
     * root-relative /storage/* URL for uploads so it works regardless of the
     * host the app is served from.
     */
    public function getImageUrlAttribute(): ?string
    {
        $image = $this->attributes['image'] ?? null;

        if (empty($image)) {
            return null;
        }

        if (Str::startsWith($image, ['http://', 'https://', '/'])) {
            return $image;
        }

        return '/storage/' . ltrim($image, '/');
    }

    public function scopeActive($query)
    {
        return $query->where('status', true);
    }

    public function scopePosition($query, string $position)
    {
        return $query->where('position', $position);
    }
}
