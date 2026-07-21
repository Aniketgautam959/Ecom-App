<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\RazorpayController;
use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    /**
     * Calculate a checkout summary before placing an order.
     */
    public function summary(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items'              => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity'   => ['required', 'integer', 'min:1'],
            'coupon_code'        => ['nullable', 'string'],
        ]);

        $subtotal = 0;
        $items = [];

        foreach ($validated['items'] as $item) {
            $product = Product::findOrFail($item['product_id']);
            $price = (float) $product->price;
            $qty = (int) $item['quantity'];
            $lineTotal = $price * $qty;
            $subtotal += $lineTotal;

            $items[] = [
                'product_id'   => $product->id,
                'product_name' => $product->name,
                'price'        => $price,
                'quantity'     => $qty,
                'total'        => $lineTotal,
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

        return response()->json([
            'data' => [
                'items'         => $items,
                'subtotal'      => $subtotal,
                'discount'      => $discount,
                'shipping_cost' => $shippingCost,
                'tax'           => $tax,
                'total'         => $total,
                'coupon_code'   => $coupon?->code,
                'coupon_applied' => $coupon !== null && $discount > 0,
            ],
        ]);
    }

    /**
     * Place an order. Delegates to the order controller.
     */
    public function placeOrder(Request $request): JsonResponse
    {
        return app(OrderController::class)->store($request);
    }

    /**
     * Verify a payment and mark it as successful.
     */
    public function paymentSuccess(Request $request): JsonResponse
    {
        return app(RazorpayController::class)->verify($request);
    }

    /**
     * Handle a failed payment attempt.
     */
    public function paymentFailed(Request $request): JsonResponse
    {
        return app(RazorpayController::class)->failed($request);
    }
}
