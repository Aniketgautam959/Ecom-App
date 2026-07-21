<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ProductMedia extends Model
{
    protected $table = 'product_media';

    protected $fillable = [
        'product_id',
        'type',
        'path',
        'disk',
        'is_external',
        'sort_order',
    ];

    protected $appends = ['url'];

    protected function casts(): array
    {
        return [
            'is_external' => 'boolean',
            'sort_order'  => 'integer',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Resolve the publicly accessible URL for this media item.
     */
    public function getUrlAttribute(): ?string
    {
        if (empty($this->path)) {
            return null;
        }

        if ($this->is_external || Str::startsWith($this->path, ['http://', 'https://'])) {
            return $this->path;
        }

        // Return a root-relative URL (e.g. /storage/products/images/xyz.png).
        // This avoids depending on APP_URL, which may not match the host the
        // app is actually served from, and works for both the admin panel and
        // the frontend (which proxies /storage/* to the backend).
        return '/storage/' . ltrim($this->path, '/');
    }
}
