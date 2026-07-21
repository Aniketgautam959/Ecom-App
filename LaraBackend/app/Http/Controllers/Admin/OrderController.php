<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\OrderShipped;
use App\Models\Order;
use App\Services\DelhiveryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search', '');
        $status = $request->query('status', '');

        $query = Order::with(['user', 'items'])->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('first_name', 'like', "%{$search}%")
                         ->orWhere('last_name', 'like', "%{$search}%")
                         ->orWhere('email_id', 'like', "%{$search}%");
                  });
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        $orders = $query->paginate(15)->withQueryString();

        return view('admin.orders.index', compact('orders', 'search', 'status'));
    }

    public function show(int $id)
    {
        $order = Order::with(['user', 'items'])->findOrFail($id);

        return view('admin.orders.show', compact('order'));
    }

    public function updateStatus(Request $request, int $id)
    {
        $request->validate([
            'status' => ['required', 'in:pending,confirmed,processing,shipped,delivered,cancelled,refunded'],
            'carrier' => ['nullable', 'string', 'max:100'],
            'tracking_number' => ['nullable', 'string', 'max:100'],
        ]);

        $order = Order::findOrFail($id);
        $status = $request->input('status');

        $update = [
            'status' => $status,
            'carrier' => $request->input('carrier'),
            'tracking_number' => $request->input('tracking_number'),
        ];

        if ($status === 'shipped' && ! $order->shipped_at) {
            $update['shipped_at'] = now();
        }

        if ($status === 'delivered' && ! $order->delivered_at) {
            $update['delivered_at'] = now();
        }

        $order->update($update);

        // Auto-update payment status for delivered COD orders
        if ($status === 'delivered' && $order->payment_method === 'cod') {
            $order->update(['payment_status' => 'paid']);
        }

        return redirect()->back()->with('success', 'Order status updated.');
    }

    public function ship(Request $request, int $id)
    {
        $request->validate([
            'carrier' => ['nullable', 'string', 'max:100'],
            'tracking_number' => ['nullable', 'string', 'max:100'],
            'weight' => ['nullable', 'numeric', 'min:0'],
        ]);

        $order = Order::findOrFail($id);

        // Use provided tracking manually if Delhivery integration is not configured.
        if ($request->filled('tracking_number')) {
            $order->update([
                'status' => 'shipped',
                'shipped_at' => now(),
                'carrier' => $request->input('carrier', 'Delhivery'),
                'tracking_number' => $request->input('tracking_number'),
            ]);
        } else {
            $order = DelhiveryService::createShipment($order, $request->input('weight'));
        }

        try {
            Mail::to($order->user->email_id)->send(new OrderShipped($order));
        } catch (\Throwable) {
        }

        return redirect()->back()->with('success', 'Order marked as shipped and customer notified.');
    }
}
