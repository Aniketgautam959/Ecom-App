<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentGateway extends Model
{
    protected $fillable = [
        'name',
        'code',
        'config',
        'status',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'config'     => 'array',
            'status'     => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
