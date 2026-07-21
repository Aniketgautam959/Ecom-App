<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\DelhiveryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class DelhiveryController extends Controller
{
    /**
     * Check serviceability for a pincode.
     */
    public function serviceability(Request $request): JsonResponse
    {
        $request->validate([
            'pincode' => ['required', 'string', 'max:10'],
        ]);

        $pincode = $request->input('pincode');
        $apiKey = config('services.delhivery.api_key');
        $apiUrl = config('services.delhivery.api_url', 'https://track.delhivery.com');

        if ($apiKey) {
            try {
                $response = Http::withHeaders([
                    'Authorization' => "Token {$apiKey}",
                ])->get("{$apiUrl}/c/api/pin-codes/json/", [
                    'filter_codes' => $pincode,
                ]);

                if ($response->successful()) {
                    return response()->json([
                        'data' => [
                            'pincode' => $pincode,
                            'serviceable' => $response->json('delivery_codes.0.postal_code') !== null,
                            'delhivery_response' => $response->json(),
                        ],
                    ]);
                }
            } catch (\Throwable $e) {
                return response()->json([
                    'message' => 'Delhivery serviceability check unavailable.',
                    'error' => $e->getMessage(),
                ], 503);
            }
        }

        return response()->json([
            'data' => [
                'pincode' => $pincode,
                'serviceable' => true,
                'message' => 'Serviceability check (mock).',
            ],
        ]);
    }

    /**
     * Create a Delhivery shipment for the order.
     */
    public function createShipment(Request $request, int $id): JsonResponse
    {
        $order = Order::findOrFail($id);

        $weight = $request->input('weight');
        $order = DelhiveryService::createShipment($order, $weight);

        return response()->json([
            'message' => 'Shipment created.',
            'data' => [
                'order_number' => $order->order_number,
                'status' => $order->status,
                'carrier' => $order->carrier,
                'tracking_number' => $order->tracking_number,
            ],
        ]);
    }

    /**
     * Track an order via Delhivery (mock/skeleton implementation).
     */
    public function track(Request $request, int $id): JsonResponse
    {
        $order = Order::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $trackingNumber = $order->tracking_number;

        if (! $trackingNumber) {
            return response()->json([
                'data' => [
                    'order_number' => $order->order_number,
                    'carrier' => $order->carrier,
                    'tracking_number' => null,
                    'status' => $order->status,
                    'events' => [],
                    'message' => 'Tracking number not available yet.',
                ],
            ]);
        }

        $apiKey = config('services.delhivery.api_key');
        $apiUrl = config('services.delhivery.api_url', 'https://track.delhivery.com');

        // If API key is configured, call Delhivery; otherwise return mock tracking.
        if ($apiKey) {
            try {
                $response = Http::withHeaders([
                    'Authorization' => "Token {$apiKey}",
                ])->get("{$apiUrl}/api/v1/packages/json/", [
                    'waybill' => $trackingNumber,
                ]);

                if ($response->successful()) {
                    return response()->json([
                        'data' => [
                            'order_number' => $order->order_number,
                            'carrier' => $order->carrier,
                            'tracking_number' => $trackingNumber,
                            'delhivery_response' => $response->json(),
                        ],
                    ]);
                }
            } catch (\Throwable $e) {
                return response()->json([
                    'message' => 'Delhivery tracking service unavailable.',
                    'error' => $e->getMessage(),
                ], 503);
            }
        }

        // Mock fallback tracking events
        $events = [
            ['status' => 'Order Placed', 'location' => 'Online', 'time' => $order->created_at->toDateTimeString()],
        ];

        if (in_array($order->status, ['shipped', 'delivered']) || $order->shipped_at) {
            $events[] = ['status' => 'Shipped', 'location' => $order->shipping_city ?? 'Warehouse', 'time' => $order->shipped_at?->toDateTimeString() ?? now()->toDateTimeString()];
        }

        if ($order->status === 'delivered' || $order->delivered_at) {
            $events[] = ['status' => 'Delivered', 'location' => $order->shipping_city ?? 'Customer Address', 'time' => $order->delivered_at?->toDateTimeString() ?? now()->toDateTimeString()];
        }

        return response()->json([
            'data' => [
                'order_number' => $order->order_number,
                'carrier' => $order->carrier,
                'tracking_number' => $trackingNumber,
                'status' => $order->status,
                'events' => $events,
            ],
        ]);
    }
}
