<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\RazorpayService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RazorpayController extends Controller
{
    /**
     * Create a Razorpay order for an existing local order.
     */
    public function createOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_id' => ['required', 'integer', 'exists:orders,id'],
        ]);

        $order = Order::where('user_id', $request->user()->id)
            ->where('payment_method', 'razorpay')
            ->findOrFail($validated['order_id']);

        $razorpayOrder = RazorpayService::createOrder($order);

        if (! $razorpayOrder) {
            return response()->json([
                'message' => 'Unable to create Razorpay order. Please try again.',
            ], 503);
        }

        return response()->json([
            'message' => 'Razorpay order created.',
            'data' => [
                'key' => config('services.razorpay.key'),
                'order_id' => $razorpayOrder['id'],
                'amount' => $razorpayOrder['amount'],
                'currency' => $razorpayOrder['currency'],
                'local_order_id' => $order->order_number,
            ],
        ]);
    }

    /**
     * Verify a Razorpay payment and update the order.
     */
    public function verify(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_id' => ['required', 'string'],
            'payment_id' => ['required', 'string'],
            'signature' => ['required', 'string'],
        ]);

        $order = Order::where('user_id', $request->user()->id)
            ->where('razorpay_order_id', $validated['order_id'])
            ->first();

        if (! $order) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        $valid = RazorpayService::verifySignature(
            $validated['order_id'],
            $validated['payment_id'],
            $validated['signature']
        );

        if (! $valid) {
            return response()->json(['message' => 'Payment verification failed.'], 400);
        }

        $order->update([
            'razorpay_payment_id' => $validated['payment_id'],
            'transaction_id' => $validated['payment_id'],
            'payment_status' => 'paid',
            'status' => 'confirmed',
        ]);

        return response()->json([
            'message' => 'Payment verified successfully.',
            'data' => [
                'order_id' => $order->order_number,
                'payment_id' => $validated['payment_id'],
            ],
        ]);
    }

    /**
     * Record a failed payment attempt.
     */
    public function failed(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_id' => ['required', 'string'],
            'error' => ['nullable', 'string'],
        ]);

        $order = Order::where('user_id', $request->user()->id)
            ->where('razorpay_order_id', $validated['order_id'])
            ->first();

        if ($order) {
            $order->update([
                'payment_status' => 'failed',
            ]);
        }

        Log::info('[RazorpayController] payment failed', [
            'razorpay_order_id' => $validated['order_id'],
            'error' => $validated['error'] ?? null,
        ]);

        return response()->json(['message' => 'Failure recorded.']);
    }

    /**
     * Handle Razorpay webhook events.
     */
    public function webhook(Request $request): JsonResponse
    {
        $signature = $request->header('X-Razorpay-Signature', '');
        $payload = $request->getContent();
        $secret = config('services.razorpay.webhook_secret');

        if (! $secret || ! RazorpayService::verifyWebhookSignature($payload, $signature, $secret)) {
            return response()->json(['message' => 'Invalid signature.'], 400);
        }

        $data = $request->all();
        $event = $data['event'] ?? '';
        $payloadData = $data['payload']['payment']['entity'] ?? [];

        Log::info('[RazorpayController] webhook received', ['event' => $event]);

        if ($event === 'payment.captured' && ! empty($payloadData['order_id'])) {
            $order = Order::where('razorpay_order_id', $payloadData['order_id'])->first();

            if ($order && $order->payment_status !== 'paid') {
                $order->update([
                    'razorpay_payment_id' => $payloadData['id'],
                    'transaction_id' => $payloadData['id'],
                    'payment_status' => 'paid',
                    'status' => 'confirmed',
                ]);
            }
        }

        return response()->json(['message' => 'Webhook handled.']);
    }
}
