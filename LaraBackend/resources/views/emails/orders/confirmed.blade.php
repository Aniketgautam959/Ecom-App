<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmed</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .header { background: #111827; color: #fff; padding: 32px 40px; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
        .header p { margin: 6px 0 0; color: #9ca3af; font-size: 14px; }
        .body { padding: 32px 40px; }
        .greeting { font-size: 16px; color: #374151; margin-bottom: 16px; }
        .order-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin-bottom: 24px; }
        .order-box .row { display: flex; justify-content: space-between; font-size: 14px; color: #374151; padding: 6px 0; border-bottom: 1px solid #e5e7eb; }
        .order-box .row:last-child { border-bottom: none; font-weight: 700; font-size: 15px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .items-table th { text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase; padding: 8px 0; border-bottom: 2px solid #e5e7eb; }
        .items-table td { font-size: 14px; color: #374151; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
        .shipping-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px 20px; margin-bottom: 24px; font-size: 14px; color: #374151; line-height: 1.7; }
        .btn { display: inline-block; background: #111827; color: #fff; padding: 12px 28px; border-radius: 4px; text-decoration: none; font-size: 14px; font-weight: 600; }
        .footer { background: #f9fafb; padding: 20px 40px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
<div class="wrapper">
    <div class="header">
        <h1>✓ Order Confirmed!</h1>
        <p>Thank you for your purchase — Order #{{ $order->order_number }}</p>
    </div>
    <div class="body">
        <p class="greeting">Hi {{ $order->shipping_name }},</p>
        <p style="font-size:14px;color:#6b7280;">We've received your order and it's being processed. You'll get another email when it ships.</p>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th style="text-align:right;">Price</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td>
                        {{ $item->product_name }}
                        @if($item->size) <span style="color:#9ca3af;font-size:12px;">({{ $item->size }})</span> @endif
                    </td>
                    <td>{{ $item->quantity }}</td>
                    <td style="text-align:right;">₹{{ number_format($item->total, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="order-box">
            <div class="row"><span>Subtotal</span><span>₹{{ number_format($order->subtotal, 2) }}</span></div>
            @if($order->discount > 0)
            <div class="row"><span>Discount</span><span style="color:#16a34a;">-₹{{ number_format($order->discount, 2) }}</span></div>
            @endif
            <div class="row"><span>Shipping</span><span>{{ $order->shipping_cost == 0 ? 'FREE' : '₹'.number_format($order->shipping_cost, 2) }}</span></div>
            <div class="row"><span>Tax (GST)</span><span>₹{{ number_format($order->tax, 2) }}</span></div>
            <div class="row"><span>Total</span><span>₹{{ number_format($order->total, 2) }}</span></div>
        </div>

        <p style="font-size:13px;font-weight:600;color:#374151;margin-bottom:8px;">Shipping To</p>
        <div class="shipping-box">
            {{ $order->shipping_name }}<br>
            {{ $order->shipping_address }}<br>
            {{ $order->shipping_city }}, {{ $order->shipping_state }} - {{ $order->shipping_pincode }}<br>
            Phone: {{ $order->shipping_phone }}
        </div>

        <a href="{{ config('app.url') }}/orders/{{ $order->id }}" class="btn">View Order</a>
    </div>
    <div class="footer">
        &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
    </div>
</div>
</body>
</html>
