@extends('layouts.admin')

@section('title', 'Order ' . $order->order_number)

@section('content')

<h1 class="mt-4">Order {{ $order->order_number }}</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item"><a href="{{ route('admin.orders.index') }}">Orders</a></li>
    <li class="breadcrumb-item active">{{ $order->order_number }}</li>
</ol>

@if (session('success'))
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        {{ session('success') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
@endif

<div class="row">
    {{-- Order Info --}}
    <div class="col-md-8">
        <div class="card mb-4">
            <div class="card-header"><i class="fas fa-box me-1"></i> Order Items</div>
            <div class="card-body p-0">
                <table class="table table-sm align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>Product</th>
                            <th>Size</th>
                            <th>Color</th>
                            <th class="text-end">Price</th>
                            <th class="text-center">Qty</th>
                            <th class="text-end">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($order->items as $item)
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        @if($item->product_image)
                                            <img src="{{ $item->product_image }}" alt="" style="width:40px;height:40px;object-fit:cover;border-radius:4px;">
                                        @endif
                                        <span>{{ $item->product_name }}</span>
                                    </div>
                                </td>
                                <td>{{ $item->size ?? '—' }}</td>
                                <td>
                                    @if($item->color)
                                        <span class="d-inline-block rounded-circle border" style="width:16px;height:16px;background:{{ $item->color }};"></span>
                                    @else
                                        —
                                    @endif
                                </td>
                                <td class="text-end">@currency {{ number_format($item->price, 2) }}</td>
                                <td class="text-center">{{ $item->quantity }}</td>
                                <td class="text-end fw-medium">@currency {{ number_format($item->total, 2) }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                    <tfoot class="table-light">
                        <tr>
                            <td colspan="5" class="text-end">Subtotal</td>
                            <td class="text-end">@currency {{ number_format($order->subtotal, 2) }}</td>
                        </tr>
                        @if($order->discount > 0)
                        <tr>
                            <td colspan="5" class="text-end text-success">Discount</td>
                            <td class="text-end text-success">-@currency {{ number_format($order->discount, 2) }}</td>
                        </tr>
                        @endif
                        <tr>
                            <td colspan="5" class="text-end">Shipping</td>
                            <td class="text-end">@currency {{ number_format($order->shipping_cost, 2) }}</td>
                        </tr>
                        <tr>
                            <td colspan="5" class="text-end">Tax (GST)</td>
                            <td class="text-end">@currency {{ number_format($order->tax, 2) }}</td>
                        </tr>
                        <tr class="fw-bold">
                            <td colspan="5" class="text-end">Total</td>
                            <td class="text-end">@currency {{ number_format($order->total, 2) }}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>

        {{-- Shipping Address --}}
        <div class="card mb-4">
            <div class="card-header"><i class="fas fa-truck me-1"></i> Shipping Address</div>
            <div class="card-body">
                <p class="mb-1 fw-medium">{{ $order->shipping_name }}</p>
                <p class="mb-1">{{ $order->shipping_address }}</p>
                <p class="mb-1">{{ $order->shipping_city }}, {{ $order->shipping_state }} - {{ $order->shipping_pincode }}</p>
                <p class="mb-1">{{ $order->shipping_country }}</p>
                <p class="mb-0"><i class="fas fa-phone me-1"></i> {{ $order->shipping_phone }}</p>
            </div>
        </div>
    </div>

    {{-- Side Panel --}}
    <div class="col-md-4">
        {{-- Status Update --}}
        <div class="card mb-4">
            <div class="card-header"><i class="fas fa-sync me-1"></i> Update Status</div>
            <div class="card-body">
                <form method="POST" action="{{ route('admin.orders.update-status', $order->id) }}">
                    @csrf
                    @method('PATCH')
                    <select name="status" class="form-select mb-2">
                        @foreach(['pending','confirmed','processing','shipped','delivered','cancelled','refunded'] as $s)
                            <option value="{{ $s }}" {{ $order->status === $s ? 'selected' : '' }}>{{ ucfirst($s) }}</option>
                        @endforeach
                    </select>
                    <div class="mb-2">
                        <input type="text" name="carrier" class="form-control form-control-sm" placeholder="Carrier" value="{{ old('carrier', $order->carrier) }}">
                    </div>
                    <div class="mb-2">
                        <input type="text" name="tracking_number" class="form-control form-control-sm" placeholder="Tracking Number" value="{{ old('tracking_number', $order->tracking_number) }}">
                    </div>
                    <button type="submit" class="btn btn-primary btn-sm w-100">Update Status</button>
                </form>

                @if(!in_array($order->status, ['shipped','delivered','cancelled']))
                <hr>
                <form method="POST" action="{{ route('admin.orders.ship', $order->id) }}">
                    @csrf
                    <div class="mb-2">
                        <input type="text" name="carrier" class="form-control form-control-sm" placeholder="Carrier (e.g. Delhivery)" value="{{ old('carrier', $order->carrier) }}">
                    </div>
                    <div class="mb-2">
                        <input type="text" name="tracking_number" class="form-control form-control-sm" placeholder="Tracking Number (auto if blank)" value="{{ old('tracking_number', $order->tracking_number) }}">
                    </div>
                    <div class="mb-2">
                        <input type="number" step="0.01" name="weight" class="form-control form-control-sm" placeholder="Weight (kg)" value="{{ old('weight', request('weight', 0.5)) }}">
                    </div>
                    <button type="submit" class="btn btn-success btn-sm w-100">
                        <i class="fas fa-truck me-1"></i> Mark as Shipped &amp; Notify Customer
                    </button>
                </form>
                @endif
            </div>
        </div>

        @if($order->tracking_number)
        <div class="card mb-4">
            <div class="card-header"><i class="fas fa-map-marker-alt me-1"></i> Tracking</div>
            <div class="card-body">
                <p class="mb-1"><strong>Carrier:</strong> {{ $order->carrier ?? 'N/A' }}</p>
                <p class="mb-1"><strong>Tracking #:</strong> {{ $order->tracking_number }}</p>
                @if($order->shipped_at)
                    <p class="mb-1"><strong>Shipped:</strong> {{ $order->shipped_at->format('M d, Y H:i') }}</p>
                @endif
                @if($order->delivered_at)
                    <p class="mb-0"><strong>Delivered:</strong> {{ $order->delivered_at->format('M d, Y H:i') }}</p>
                @endif
            </div>
        </div>
        @endif

        {{-- Order Summary --}}
        <div class="card mb-4">
            <div class="card-header"><i class="fas fa-info-circle me-1"></i> Summary</div>
            <div class="card-body">
                <dl class="row mb-0">
                    <dt class="col-5">Status</dt>
                    <dd class="col-7">
                        @php $badge = $order->status_badge; @endphp
                        <span class="badge {{ $badge['class'] }}">{{ $badge['label'] }}</span>
                    </dd>
                    <dt class="col-5">Payment</dt>
                    <dd class="col-7">{{ strtoupper($order->payment_method) }}</dd>
                    <dt class="col-5">Pay Status</dt>
                    <dd class="col-7">
                        <span class="badge {{ $order->payment_status === 'paid' ? 'bg-success' : 'bg-secondary' }}">
                            {{ ucfirst($order->payment_status) }}
                        </span>
                    </dd>
                    <dt class="col-5">Customer</dt>
                    <dd class="col-7">{{ $order->user?->first_name }} {{ $order->user?->last_name }}</dd>
                    <dt class="col-5">Email</dt>
                    <dd class="col-7 text-truncate">{{ $order->user?->email_id }}</dd>
                    <dt class="col-5">Date</dt>
                    <dd class="col-7">{{ $order->created_at->format('M d, Y H:i') }}</dd>
                    @if($order->coupon_code)
                    <dt class="col-5">Coupon</dt>
                    <dd class="col-7"><code>{{ $order->coupon_code }}</code></dd>
                    @endif
                    @if($order->notes)
                    <dt class="col-5">Notes</dt>
                    <dd class="col-7">{{ $order->notes }}</dd>
                    @endif
                </dl>
            </div>
        </div>
    </div>
</div>

@endsection
