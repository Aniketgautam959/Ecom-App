<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Shipped</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .header { background: #1d4ed8; color: #fff; padding: 32px 40px; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
        .header p { margin: 6px 0 0; color: #bfdbfe; font-size: 14px; }
        .body { padding: 32px 40px; }
        .tracking-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 20px; margin: 20px 0; text-align: center; }
        .tracking-box p { margin: 0 0 6px; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; }
        .tracking-box span { font-size: 24px; font-weight: 700; color: #1d4ed8; }
        .timeline { list-style: none; padding: 0; margin: 24px 0; }
        .timeline li { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #374151; padding: 8px 0; }
        .timeline li .dot { width: 10px; height: 10px; border-radius: 50%; background: #1d4ed8; flex-shrink: 0; }
        .btn { display: inline-block; background: #1d4ed8; color: #fff; padding: 12px 28px; border-radius: 4px; text-decoration: none; font-size: 14px; font-weight: 600; }
        .footer { background: #f9fafb; padding: 20px 40px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
<div class="wrapper">
    <div class="header">
        <h1>🚚 Your Order is on the Way!</h1>
        <p>Order #{{ $order->order_number }} has been shipped</p>
    </div>
    <div class="body">
        <p style="font-size:16px;color:#374151;">Hi {{ $order->shipping_name }},</p>
        <p style="font-size:14px;color:#6b7280;">Great news! Your order has been handed over to the courier and is on its way to you.</p>

        @if($order->tracking_number)
        <div class="tracking-box">
            <p>Tracking Number</p>
            <span>{{ $order->tracking_number }}</span>
            @if($order->carrier)
            <p style="margin-top:8px;">via <strong>{{ $order->carrier }}</strong></p>
            @endif
        </div>
        @endif

        <ul class="timeline">
            <li><span class="dot"></span> Order Placed — {{ $order->created_at->format('M d, Y') }}</li>
            <li><span class="dot"></span> Order Confirmed</li>
            <li><span class="dot"></span> Shipped — {{ now()->format('M d, Y') }}</li>
            <li><span class="dot" style="background:#d1d5db;"></span> Delivered — Estimated soon</li>
        </ul>

        <p style="font-size:13px;font-weight:600;color:#374151;margin-bottom:6px;">Delivering To</p>
        <p style="font-size:14px;color:#6b7280;line-height:1.7;">
            {{ $order->shipping_address }},
            {{ $order->shipping_city }}, {{ $order->shipping_state }} - {{ $order->shipping_pincode }}
        </p>

        <a href="{{ config('app.url') }}/orders/{{ $order->id }}" class="btn">Track Order</a>
    </div>
    <div class="footer">
        &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
    </div>
</div>
</body>
</html>
