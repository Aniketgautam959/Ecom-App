@extends('layouts.admin')

@section('title', 'Orders')

@section('content')

<h1 class="mt-4">Orders</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item active">Orders</li>
</ol>

@if (session('success'))
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        {{ session('success') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
@endif

<div class="card mb-4">
    <div class="card-header d-flex justify-content-between align-items-center">
        <div><i class="fas fa-shopping-bag me-1"></i> All Orders</div>
    </div>
    <div class="card-body">
        <form method="GET" action="{{ route('admin.orders.index') }}" class="row g-2 mb-3">
            <div class="col-md-5">
                <input type="text" name="search" value="{{ $search }}" class="form-control"
                       placeholder="Search by order number, customer name or email...">
            </div>
            <div class="col-md-3">
                <select name="status" class="form-select">
                    <option value="">All Status</option>
                    @foreach(['pending','confirmed','processing','shipped','delivered','cancelled','refunded'] as $s)
                        <option value="{{ $s }}" {{ $status === $s ? 'selected' : '' }}>{{ ucfirst($s) }}</option>
                    @endforeach
                </select>
            </div>
            <div class="col-md-4 d-flex gap-2">
                <button type="submit" class="btn btn-outline-primary w-100">
                    <i class="fas fa-search me-1"></i> Filter
                </button>
                <a href="{{ route('admin.orders.index') }}" class="btn btn-outline-secondary">Reset</a>
            </div>
        </form>

        <div class="table-responsive">
            <table class="table table-bordered table-hover align-middle">
                <thead class="table-light">
                    <tr>
                        <th>Order #</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($orders as $order)
                        <tr>
                            <td><code>{{ $order->order_number }}</code></td>
                            <td>
                                <div class="fw-medium">{{ $order->user?->first_name }} {{ $order->user?->last_name }}</div>
                                <small class="text-muted">{{ $order->user?->email_id }}</small>
                            </td>
                            <td>{{ $order->items->count() }}</td>
                            <td class="fw-semibold">@currency {{ number_format($order->total, 2) }}</td>
                            <td>
                                <span class="badge {{ $order->payment_status === 'paid' ? 'bg-success' : ($order->payment_status === 'failed' ? 'bg-danger' : 'bg-secondary') }}">
                                    {{ ucfirst($order->payment_status) }}
                                </span>
                                <br><small class="text-muted">{{ strtoupper($order->payment_method) }}</small>
                            </td>
                            <td>
                                @php $badge = $order->status_badge; @endphp
                                <span class="badge {{ $badge['class'] }}">{{ $badge['label'] }}</span>
                            </td>
                            <td><small>{{ $order->created_at->format('M d, Y H:i') }}</small></td>
                            <td class="text-end">
                                <a href="{{ route('admin.orders.show', $order->id) }}" class="btn btn-sm btn-outline-primary">
                                    <i class="fas fa-eye"></i>
                                </a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="8" class="text-center text-muted py-4">No orders found.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">
                Showing {{ $orders->firstItem() ?? 0 }}–{{ $orders->lastItem() ?? 0 }}
                of {{ $orders->total() }}
            </small>
            {{ $orders->links() }}
        </div>
    </div>
</div>

@endsection
