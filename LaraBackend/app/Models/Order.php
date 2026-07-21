<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'user_id',
        'status',
        'subtotal',
        'discount',
        'shipping_cost',
        'tax',
        'total',
        'coupon_code',
        'coupon_id',
        'payment_method',
        'payment_status',
        'transaction_id',
        'razorpay_order_id',
        'razorpay_payment_id',
        'shipping_name',
        'shipping_phone',
        'shipping_address',
        'shipping_city',
        'shipping_state',
        'shipping_pincode',
        'shipping_country',
        'notes',
        'tracking_number',
        'carrier',
        'shipped_at',
        'delivered_at',
    ];

    protected function casts(): array
    {
        return [
            'subtotal'      => 'decimal:2',
            'discount'      => 'decimal:2',
            'shipping_cost' => 'decimal:2',
            'tax'           => 'decimal:2',
            'total'         => 'decimal:2',
            'shipped_at'    => 'datetime',
            'delivered_at'  => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Generate a unique order number.
     */
    public static function generateOrderNumber(): string
    {
        do {
            $number = 'ORD-' . strtoupper(uniqid());
        } while (self::where('order_number', $number)->exists());

        return $number;
    }

    /**
     * Status label with color class.
     */
    public function getStatusBadgeAttribute(): array
    {
        return match ($this->status) {
            'pending'    => ['label' => 'Pending', 'class' => 'bg-warning'],
            'confirmed'  => ['label' => 'Confirmed', 'class' => 'bg-info'],
            'processing' => ['label' => 'Processing', 'class' => 'bg-primary'],
            'shipped'    => ['label' => 'Shipped', 'class' => 'bg-info'],
            'delivered'  => ['label' => 'Delivered', 'class' => 'bg-success'],
            'cancelled'  => ['label' => 'Cancelled', 'class' => 'bg-danger'],
            'refunded'   => ['label' => 'Refunded', 'class' => 'bg-secondary'],
            default      => ['label' => ucfirst($this->status), 'class' => 'bg-secondary'],
        };
    }
}
