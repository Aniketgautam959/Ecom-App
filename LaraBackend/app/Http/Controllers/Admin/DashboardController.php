<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        $totalUsers     = User::count();
        $totalProducts  = Product::count();
        $totalCategories = Category::count();
        $totalBrands    = Brand::count();
        $activeProducts = Product::where('status', true)->count();
        $latestProducts = Product::with(['category', 'brand'])
            ->latest()
            ->limit(5)
            ->get();

        return view('admin.dashboard', compact(
            'totalUsers',
            'totalProducts',
            'totalCategories',
            'totalBrands',
            'activeProducts',
            'latestProducts',
        ));
    }
}
