<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        $currencyCode = Setting::get('currency_code', 'INR');
        $currencySymbol = Setting::get('currency_symbol', '₹');
        $shippingFlatRate = Setting::get('shipping_flat_rate', '50');
        $shippingFreeThreshold = Setting::get('shipping_free_threshold', '500');
        $taxRate = Setting::get('tax_rate', '18');
        $razorpayEnabled = Setting::get('razorpay_enabled', '1') === '1';
        $razorpayKey = Setting::get('razorpay_key', config('services.razorpay.key', ''));

        return view('admin.settings.index', compact(
            'currencyCode',
            'currencySymbol',
            'shippingFlatRate',
            'shippingFreeThreshold',
            'taxRate',
            'razorpayEnabled',
            'razorpayKey'
        ));
    }

    public function update(Request $request)
    {
        $request->validate([
            'currency_code' => ['required', 'string', 'max:10'],
            'currency_symbol' => ['required', 'string', 'max:5'],
            'shipping_flat_rate' => ['required', 'numeric', 'min:0'],
            'shipping_free_threshold' => ['required', 'numeric', 'min:0'],
            'tax_rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'razorpay_key' => ['nullable', 'string', 'max:255'],
        ]);

        Setting::set('currency_code', $request->input('currency_code'));
        Setting::set('currency_symbol', $request->input('currency_symbol'));
        Setting::set('shipping_flat_rate', $request->input('shipping_flat_rate'));
        Setting::set('shipping_free_threshold', $request->input('shipping_free_threshold'));
        Setting::set('tax_rate', $request->input('tax_rate'));
        Setting::set('razorpay_enabled', $request->boolean('razorpay_enabled', false) ? '1' : '0');
        Setting::set('razorpay_key', $request->input('razorpay_key', ''));

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }
}
