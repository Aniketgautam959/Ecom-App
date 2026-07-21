<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Setting;
use Illuminate\Support\Facades\Log;
use Razorpay\Api\Api;

class RazorpayService
{
    public static function api(): Api
    {
        $key = Setting::get('razorpay_key') ?: (string) config('services.razorpay.key');
        $secret = (string) config('services.razorpay.secret');

        return new Api($key, $secret);
    }

    /**
     * Create a Razorpay order for the given local order.
     *
     * @return array<string, mixed>|null
     */
    public static function createOrder(Order $order): ?array
    {
        try {
            $api = self::api();

            $razorpayOrder = $api->order->create([
                'amount'          => (int) round($order->total * 100),
                'currency'        => Setting::currencyCode() ?: 'INR',
                'receipt'         => $order->order_number,
                'payment_capture' => 1,
                'notes'           => [
                    'order_id' => (string) $order->id,
                    'customer_email' => $order->user?->email ?? '',
                ],
            ]);

            $order->update(['razorpay_order_id' => $razorpayOrder['id']]);

            return [
                'id'     => $razorpayOrder['id'],
                'amount' => (int) $razorpayOrder['amount'],
                'currency' => $razorpayOrder['currency'],
                'receipt' => $razorpayOrder['receipt'],
            ];
        } catch (\Throwable $e) {
            Log::error('[RazorpayService] create order failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Verify Razorpay payment signature.
     */
    public static function verifySignature(string $orderId, string $paymentId, string $signature): bool
    {
        try {
            $api = self::api();
            $api->utility->verifyPaymentSignature([
                'razorpay_order_id'   => $orderId,
                'razorpay_payment_id' => $paymentId,
                'razorpay_signature'  => $signature,
            ]);

            return true;
        } catch (\Throwable $e) {
            Log::warning('[RazorpayService] signature verification failed', [
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Verify Razorpay webhook signature.
     */
    public static function verifyWebhookSignature(string $payload, string $signature, string $secret): bool
    {
        $expected = hash_hmac('sha256', $payload, $secret);

        return hash_equals($expected, $signature);
    }
}
