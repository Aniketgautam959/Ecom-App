<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingMethod extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'price',
        'free_threshold',
        'is_default',
        'status',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'price'          => 'decimal:2',
            'free_threshold' => 'decimal:2',
            'is_default'     => 'boolean',
            'status'         => 'boolean',
            'sort_order'     => 'integer',
        ];
    }
}
