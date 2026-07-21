@extends('layouts.admin')

@section('title', 'Settings')

@section('content')
<div class="d-flex align-items-center justify-content-between mt-4 mb-3">
    <div>
        <h1 class="h4 mb-0">Settings</h1>
        <ol class="breadcrumb mb-0 small">
            <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
            <li class="breadcrumb-item active">Settings</li>
        </ol>
    </div>
</div>

@if(session('success'))
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        {{ session('success') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
@endif

<div class="card" style="max-width:560px;">
    <div class="card-header">
        <h5 class="card-title mb-0">Currency Settings</h5>
    </div>
    <div class="card-body">
        <form method="POST" action="{{ route('admin.settings.update') }}">
            @csrf @method('PUT')

            <div class="mb-3">
                <label for="currency_code" class="form-label fw-medium">Currency Code</label>
                <select name="currency_code" id="currency_code" class="form-select" onchange="updateSymbol(this)">
                    @php
                        $currencies = [
                            'INR' => '₹',
                            'USD' => '$',
                            'EUR' => '€',
                            'GBP' => '£',
                            'JPY' => '¥',
                            'AUD' => 'A$',
                            'CAD' => 'C$',
                            'SGD' => 'S$',
                            'AED' => 'د.إ',
                            'SAR' => '﷼',
                            'BDT' => '৳',
                            'PKR' => '₨',
                            'LKR' => '₨',
                            'NPR' => '₨',
                            'MYR' => 'RM',
                            'THB' => '฿',
                            'CNY' => '¥',
                            'KRW' => '₩',
                            'RUB' => '₽',
                            'BRL' => 'R$',
                            'ZAR' => 'R',
                            'NGN' => '₦',
                            'KES' => 'KSh',
                        ];
                    @endphp
                    @foreach($currencies as $code => $symbol)
                        <option value="{{ $code }}" data-symbol="{{ $symbol }}" {{ $currencyCode === $code ? 'selected' : '' }}>
                            {{ $code }} ({{ $symbol }})
                        </option>
                    @endforeach
                </select>
                <div class="form-text">Select the currency for your store.</div>
            </div>

            <div class="mb-3">
                <label for="currency_symbol" class="form-label fw-medium">Currency Symbol</label>
                <div class="input-group" style="max-width:120px;">
                    <input type="text" id="currency_symbol" name="currency_symbol"
                        class="form-control text-center fs-4 fw-bold"
                        value="{{ $currencySymbol }}" required maxlength="5">
                </div>
                <div class="form-text">This symbol will be shown across the store.</div>
            </div>

            <div class="mb-3">
                <label class="form-label fw-medium">Preview</label>
                <div class="p-3 bg-light rounded">
                    <span class="fs-5 fw-bold" id="preview">{{ $currencySymbol }} 1,499.00</span>
                </div>
            </div>

            <hr class="my-4">
            <h6 class="mb-3">Shipping Settings</h6>

            <div class="mb-3">
                <label for="shipping_flat_rate" class="form-label fw-medium">Flat Shipping Rate</label>
                <input type="number" step="0.01" id="shipping_flat_rate" name="shipping_flat_rate"
                    class="form-control" value="{{ $shippingFlatRate }}" required>
                <div class="form-text">Default shipping charge for orders below the free threshold.</div>
            </div>

            <div class="mb-3">
                <label for="shipping_free_threshold" class="form-label fw-medium">Free Shipping Threshold</label>
                <input type="number" step="0.01" id="shipping_free_threshold" name="shipping_free_threshold"
                    class="form-control" value="{{ $shippingFreeThreshold }}" required>
                <div class="form-text">Orders above this amount get free shipping. Set 0 to disable.</div>
            </div>

            <hr class="my-4">
            <h6 class="mb-3">Tax Settings</h6>

            <div class="mb-3">
                <label for="tax_rate" class="form-label fw-medium">Tax Rate (%)</label>
                <input type="number" step="0.01" id="tax_rate" name="tax_rate"
                    class="form-control" value="{{ $taxRate }}" required>
                <div class="form-text">Percentage tax applied to order subtotal.</div>
            </div>

            <hr class="my-4">
            <h6 class="mb-3">Payment Gateway Settings</h6>

            <div class="mb-3 form-check form-switch">
                <input type="checkbox" id="razorpay_enabled" name="razorpay_enabled" value="1"
                    class="form-check-input" {{ $razorpayEnabled ? 'checked' : '' }}>
                <label class="form-check-label" for="razorpay_enabled">Enable Razorpay</label>
            </div>

            <div class="mb-3">
                <label for="razorpay_key" class="form-label fw-medium">Razorpay Key (Public)</label>
                <input type="text" id="razorpay_key" name="razorpay_key"
                    class="form-control" value="{{ $razorpayKey }}" placeholder="rzp_test_...">
                <div class="form-text">Razorpay secret remains in .env file.</div>
            </div>

            <button type="submit" class="btn btn-dark">Save Settings</button>
        </form>
    </div>
</div>

<script>
function updateSymbol(select) {
    const option = select.options[select.selectedIndex];
    const symbol = option.getAttribute('data-symbol');
    document.getElementById('currency_symbol').value = symbol;
    document.getElementById('preview').textContent = symbol + ' 1,499.00';
}
</script>
@endsection
