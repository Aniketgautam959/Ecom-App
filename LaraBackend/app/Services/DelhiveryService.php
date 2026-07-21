<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DelhiveryService
{
    public static function createShipment(Order $order, ?float $weight = null): Order
    {
        $apiKey = config('services.delhivery.api_key');
        $apiUrl = rtrim(config('services.delhivery.api_url', 'https://track.delhivery.com'), '/');

        if (! $apiKey) {
            return self::markShipped($order, $order->tracking_number, $order->carrier);
        }

        $pickup = config('services.delhivery.pickup_location', 'Default');
        $weight = $weight ?? 0.5;

        $items = $order->items;
        $productDesc = $items->pluck('product_name')->implode(', ');
        $pieces = $items->sum('quantity');

        $shipment = [
            'name' => $order->shipping_name,
            'address' => $order->shipping_address,
            'address_1' => $order->shipping_address,
            'city' => $order->shipping_city,
            'state' => $order->shipping_state,
            'pin' => $order->shipping_pincode,
            'country' => $order->shipping_country,
            'phone' => $order->shipping_phone,
            'order' => $order->order_number,
            'order_date' => $order->created_at->format('Y-m-d H:i:s'),
            'payment_mode' => $order->payment_method === 'cod' ? 'COD' : 'Prepaid',
            'total_amount' => (float) $order->total,
            'weight' => (float) $weight,
            'quantity' => $pieces,
            'products_desc' => $productDesc,
            'pickup_location' => $pickup,
            'return_name' => config('services.delhivery.shipper_name', $order->shipping_name),
            'return_address' => config('services.delhivery.shipper_address', $order->shipping_address),
            'return_city' => config('services.delhivery.shipper_city', $order->shipping_city),
            'return_state' => config('services.delhivery.shipper_state', $order->shipping_state),
            'return_pin' => config('services.delhivery.shipper_pin', $order->shipping_pincode),
            'return_phone' => config('services.delhivery.shipper_phone', $order->shipping_phone),
            'courier_id' => null,
        ];

        try {
            $response = Http::withHeaders([
                'Authorization' => "Token {$apiKey}",
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->post("{$apiUrl}/api/cmu/create.json", [
                'pickup_location' => $pickup,
                'shipments' => [$shipment],
                'mode' => 'E-Express',
            ]);

            if ($response->successful()) {
                $data = $response->json();
                Log::info('Delhivery create shipment response', $data);

                $waybill = $data['packages'][0]['waybill'] ?? $data['packages'][0]['refnum'] ?? null;

                if ($waybill) {
                    return self::markShipped($order, $waybill, 'Delhivery');
                }
            }

            Log::warning('Delhivery create shipment failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
        } catch (\Throwable $e) {
            Log::error('Delhivery create shipment error', ['error' => $e->getMessage()]);
        }

        return self::markShipped($order, $order->tracking_number, $order->carrier ?: 'Delhivery');
    }

    private static function markShipped(Order $order, ?string $trackingNumber, ?string $carrier): Order
    {
        $order->update([
            'status' => 'shipped',
            'shipped_at' => now(),
            'tracking_number' => $trackingNumber,
            'carrier' => $carrier,
        ]);

        return $order->fresh();
    }
}
