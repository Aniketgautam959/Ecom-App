<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\OrderConfirmed;
use App\Mail\OrderShipped;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use App\Services\DelhiveryService;
use App\Services\RazorpayService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{
    /**
     * List orders for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with('items')
            ->latest()
            ->get()
            ->map(fn (Order $o) => $this->formatOrder($o));

        return response()->json(['data' => $orders]);
    }

    /**
     * Show a single order.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $order = Order::where('user_id', $request->user()->id)
            ->with('items')
            ->findOrFail($id);

        return response()->json(['data' => $this->formatOrder($order, true)]);
    }

    /**
     * Place a new order.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items'                  => ['required', 'array', 'min:1'],
            'items.*.product_id'     => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity'       => ['required', 'integer', 'min:1'],
            'items.*.size'           => ['nullable', 'string'],
            'items.*.color'          => ['nullable', 'string'],
            'shipping_name'          => ['required', 'string', 'max:255'],
            'shipping_phone'        => ['required', 'string', 'max:20'],
            'shipping_address'       => ['required', 'string', 'max:500'],
            'shipping_city'          => ['required', 'string', 'max:100'],
            'shipping_state'         => ['required', 'string', 'max:100'],
            'shipping_pincode'       => ['required', 'string', 'max:10'],
            'shipping_country'       => ['nullable', 'string', 'max:100'],
            'payment_method'         => ['required', 'in:cod,razorpay,paypal'],
            'coupon_code'            => ['nullable', 'string'],
            'notes'                  => ['nullable', 'string', 'max:1000'],
        ]);

        $order = DB::transaction(function () use ($validated, $request) {
            $subtotal = 0;
            $itemsData = [];

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $price = (float) $product->price;
                $qty = (int) $item['quantity'];
                $lineTotal = $price * $qty;
                $subtotal += $lineTotal;

                $itemsData[] = [
                    'product_id'    => $product->id,
                    'product_name'  => $product->name,
                    'product_image' => $product->main_image,
                    'size'          => $item['size'] ?? null,
                    'color'         => $item['color'] ?? null,
                    'price'         => $price,
                    'quantity'      => $qty,
                    'total'         => $lineTotal,
                ];
            }

            $discount = 0;
            $coupon = null;
            if (! empty($validated['coupon_code'])) {
                $coupon = Coupon::where('code', $validated['coupon_code'])->first();
                if ($coupon && $coupon->isActive() && $subtotal >= $coupon->min_order_amount) {
                    $discount = $coupon->calculateDiscount($subtotal);
                }
            }

            $shippingFlatRate = (float) \App\Models\Setting::get('shipping_flat_rate', '50');
            $shippingFreeThreshold = (float) \App\Models\Setting::get('shipping_free_threshold', '500');
            $taxRate = (float) \App\Models\Setting::get('tax_rate', '18');

            $shippingCost = $subtotal >= $shippingFreeThreshold ? 0 : $shippingFlatRate;
            $tax = round($subtotal * ($taxRate / 100), 2);
            $total = round($subtotal - $discount + $shippingCost + $tax, 2);

            $order = Order::create([
                'order_number'     => Order::generateOrderNumber(),
                'user_id'          => $request->user()->id,
                'status'           => 'pending',
                'subtotal'         => $subtotal,
                'discount'         => $discount,
                'shipping_cost'    => $shippingCost,
                'tax'              => $tax,
                'total'            => $total,
                'coupon_code'      => $coupon?->code,
                'coupon_id'        => $coupon?->id,
                'payment_method'   => $validated['payment_method'],
                'payment_status'   => 'unpaid',
                'shipping_name'    => $validated['shipping_name'],
                'shipping_phone'   => $validated['shipping_phone'],
                'shipping_address' => $validated['shipping_address'],
                'shipping_city'    => $validated['shipping_city'],
                'shipping_state'   => $validated['shipping_state'],
                'shipping_pincode' => $validated['shipping_pincode'],
                'shipping_country' => $validated['shipping_country'] ?? 'India',
                'notes'            => $validated['notes'] ?? null,
            ]);

            $order->items()->createMany($itemsData);

            if ($coupon) {
                $coupon->increment('usage_count');
                DB::table('coupon_usages')->insert([
                    'coupon_id' => $coupon->id,
                    'user_id' => $request->user()->id,
                    'order_id' => $order->id,
                    'used_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // If COD, mark as confirmed immediately
            if ($validated['payment_method'] === 'cod') {
                $order->update(['status' => 'confirmed']);
            }

            return $order->load('items');
        });

        $razorpayOrder = null;
        if ($validated['payment_method'] === 'razorpay') {
            $razorpayOrder = RazorpayService::createOrder($order);
        }

        $response = [
            'message' => 'Order placed successfully.',
            'data'    => $this->formatOrder($order, true),
        ];

        if ($validated['payment_method'] === 'razorpay') {
            $razorpayEnabled = \App\Models\Setting::get('razorpay_enabled', '1') === '1' && ! empty($razorpayOrder);
            $response['razorpay'] = [
                'enabled' => $razorpayEnabled,
                'key'     => \App\Models\Setting::get('razorpay_key') ?: config('services.razorpay.key', ''),
                'order'   => $razorpayOrder,
            ];
        }

        try {
            Mail::to($request->user()->email_id)->send(new OrderConfirmed($order));
        } catch (\Throwable) {
        }

        return response()->json($response, 201);
    }

    /**
     * Cancel an order (only if pending/confirmed).
     */
    public function cancel(Request $request, int $id): JsonResponse
    {
        $order = Order::where('user_id', $request->user()->id)->findOrFail($id);

        if (!in_array($order->status, ['pending', 'confirmed'])) {
            return response()->json(['message' => 'Order cannot be cancelled at this stage.'], 422);
        }

        $order->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Order cancelled successfully.']);
    }

    /**
     * Admin: mark order as shipped and send shipping notification email.
     */
    public function markShipped(Request $request, int $id): JsonResponse
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'tracking_number' => ['nullable', 'string', 'max:100'],
            'carrier'         => ['nullable', 'string', 'max:100'],
            'weight'          => ['nullable', 'numeric', 'min:0'],
        ]);

        if (! empty($validated['tracking_number'])) {
            $order->update([
                'status'          => 'shipped',
                'shipped_at'      => now(),
                'tracking_number' => $validated['tracking_number'],
                'carrier'         => $validated['carrier'] ?? $order->carrier ?? 'Delhivery',
            ]);
        } else {
            $order = DelhiveryService::createShipment($order, $validated['weight'] ?? null);
        }

        try {
            Mail::to($order->user->email_id)->send(new OrderShipped($order));
        } catch (\Throwable) {
        }

        return response()->json(['message' => 'Order marked as shipped and customer notified.']);
    }

    /**
     * Track order status timeline.
     */
    public function track(Request $request, int $id): JsonResponse
    {
        $order = Order::where('user_id', $request->user()->id)
            ->with('items')
            ->findOrFail($id);

        $timeline = [
            ['status' => 'pending', 'label' => 'Order Placed', 'completed' => true, 'at' => $order->created_at->toDateTimeString()],
            ['status' => 'confirmed', 'label' => 'Order Confirmed', 'completed' => in_array($order->status, ['confirmed', 'processing', 'shipped', 'delivered']), 'at' => null],
            ['status' => 'processing', 'label' => 'Processing', 'completed' => in_array($order->status, ['processing', 'shipped', 'delivered']), 'at' => null],
            ['status' => 'shipped', 'label' => 'Shipped', 'completed' => in_array($order->status, ['shipped', 'delivered']), 'at' => $order->shipped_at?->toDateTimeString()],
            ['status' => 'delivered', 'label' => 'Delivered', 'completed' => $order->status === 'delivered', 'at' => $order->delivered_at?->toDateTimeString()],
        ];

        return response()->json([
            'data' => [
                'order_number' => $order->order_number,
                'status' => $order->status,
                'carrier' => $order->carrier,
                'tracking_number' => $order->tracking_number,
                'timeline' => $timeline,
            ],
        ]);
    }

    /**
     * Format order for API response.
     */
    private function formatOrder(Order $order, bool $detailed = false): array
    {
        $data = [
            'id'             => $order->id,
            'order_number'   => $order->order_number,
            'status'         => $order->status,
            'total'          => $order->total,
            'payment_method' => $order->payment_method,
            'payment_status' => $order->payment_status,
            'items_count'    => $order->items->count(),
            'created_at'     => $order->created_at->toDateTimeString(),
            'date'           => $order->created_at->format('M d, Y'),
        ];

        if ($detailed) {
            $data['subtotal']      = $order->subtotal;
            $data['discount']      = $order->discount;
            $data['shipping_cost'] = $order->shipping_cost;
            $data['tax']           = $order->tax;
            $data['coupon_code']   = $order->coupon_code;
            $data['notes']         = $order->notes;
            $data['shipping']      = [
                'name'    => $order->shipping_name,
                'phone'   => $order->shipping_phone,
                'address' => $order->shipping_address,
                'city'    => $order->shipping_city,
                'state'   => $order->shipping_state,
                'pincode' => $order->shipping_pincode,
                'country' => $order->shipping_country,
            ];
            $data['items'] = $order->items->map(fn ($item) => [
                'id'            => $item->id,
                'product_id'    => $item->product_id,
                'product_name'  => $item->product_name,
                'product_image' => $item->product_image,
                'size'          => $item->size,
                'color'         => $item->color,
                'price'         => $item->price,
                'quantity'      => $item->quantity,
                'total'         => $item->total,
            ]);
        }

        return $data;
    }
}
