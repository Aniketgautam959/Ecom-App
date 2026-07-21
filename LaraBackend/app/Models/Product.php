<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'category_id',
        'brand_id',
        'price',
        'image',
        'status',
    ];

    protected $appends = ['main_image', 'gallery', 'video', 'sizes', 'colors'];

    protected function casts(): array
    {
        return [
            'status' => 'boolean',
            'price'  => 'decimal:2',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function media(): HasMany
    {
        return $this->hasMany(ProductMedia::class)->orderBy('sort_order');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductMedia::class)->where('type', 'image')->orderBy('sort_order');
    }

    public function videos(): HasMany
    {
        return $this->hasMany(ProductMedia::class)->where('type', 'video')->orderBy('sort_order');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    /**
     * Available sizes derived from variants.
     */
    public function getSizesAttribute(): array
    {
        return $this->variants
            ->pluck('size')
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    /**
     * Available colors derived from variants.
     */
    public function getColorsAttribute(): array
    {
        return $this->variants
            ->filter(fn (ProductVariant $v) => $v->color_hex)
            ->unique('color_hex')
            ->map(fn (ProductVariant $v) => [
                'name' => $v->color_name,
                'hex'  => $v->color_hex,
            ])
            ->values()
            ->all();
    }

    /**
     * Ordered list of image gallery items exposed to API consumers.
     */
    public function getGalleryAttribute(): array
    {
        return $this->media
            ->where('type', 'image')
            ->sortBy('sort_order')
            ->map(fn (ProductMedia $m) => ['id' => $m->id, 'url' => $m->url])
            ->values()
            ->all();
    }

    /**
     * Resolved product video URL (uploaded file or external URL), if any.
     */
    public function getVideoAttribute(): ?string
    {
        $video = $this->media->firstWhere('type', 'video');

        return $video?->url;
    }

    /**
     * Main product image: falls back to the first gallery image when the
     * legacy `image` column is empty.
     */
    public function getMainImageAttribute(): ?string
    {
        if (! empty($this->attributes['image'] ?? null)) {
            return $this->attributes['image'];
        }

        $first = $this->media->where('type', 'image')->sortBy('sort_order')->first();

        return $first?->url;
    }
}
