<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request): View
    {
        $start = $request->date('start') ?? now()->subDays(30)->startOfDay();
        $end = $request->date('end') ?? now()->endOfDay();

        $ordersQuery = Order::whereBetween('created_at', [$start, $end]);
        $totalOrders = $ordersQuery->count();
        $totalSales = $ordersQuery->sum('total');
        $averageOrderValue = $totalOrders > 0 ? round($totalSales / $totalOrders, 2) : 0;

        $newCustomers = User::whereBetween('created_at', [$start, $end])->count();

        $statusCounts = Order::whereBetween('created_at', [$start, $end])
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        $salesChart = Order::whereBetween('created_at', [$start, $end])
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total) as total'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $topProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereBetween('orders.created_at', [$start, $end])
            ->select('order_items.product_name', DB::raw('SUM(order_items.quantity) as qty'), DB::raw('SUM(order_items.total) as revenue'))
            ->groupBy('order_items.product_name')
            ->orderByDesc('qty')
            ->limit(10)
            ->get();

        return view('admin.reports.index', [
            'start' => $start->format('Y-m-d'),
            'end' => $end->format('Y-m-d'),
            'totalOrders' => $totalOrders,
            'totalSales' => $totalSales,
            'averageOrderValue' => $averageOrderValue,
            'newCustomers' => $newCustomers,
            'statusCounts' => $statusCounts,
            'salesChart' => $salesChart,
            'topProducts' => $topProducts,
        ]);
    }
}
