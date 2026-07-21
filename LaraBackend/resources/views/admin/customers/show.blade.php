@extends('layouts.admin')

@section('title', 'Customer Details')

@section('content')

<h1 class="mt-4">Customer Details</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item"><a href="{{ route('admin.customers.index') }}">Customers</a></li>
    <li class="breadcrumb-item active">#{{ $customer->id }}</li>
</ol>

<div class="row">
    <div class="col-md-4">
        <div class="card mb-4">
            <div class="card-header"><i class="fas fa-user me-1"></i> Info</div>
            <div class="card-body">
                <h5 class="card-title">{{ $customer->first_name }} {{ $customer->last_name }}</h5>
                <p class="card-text mb-1"><strong>Email:</strong> {{ $customer->email_id }}</p>
                <p class="card-text mb-1"><strong>Phone:</strong> {{ $customer->phone_number ?? 'N/A' }}</p>
                <p class="card-text mb-1"><strong>Status:</strong>
                    <span class="badge {{ $customer->status ? 'bg-success' : 'bg-secondary' }}">
                        {{ $customer->status ? 'Active' : 'Inactive' }}
                    </span>
                </p>
                <p class="card-text mb-1"><strong>Joined:</strong> {{ $customer->created_at->format('M d, Y H:i') }}</p>
            </div>
        </div>
    </div>

    <div class="col-md-8">
        <div class="card mb-4">
            <div class="card-header"><i class="fas fa-chart-bar me-1"></i> Stats</div>
            <div class="card-body">
                <div class="row text-center">
                    <div class="col-md-4 mb-3">
                        <h4>{{ $customer->orders_count }}</h4>
                        <p class="text-muted mb-0">Total Orders</p>
                    </div>
                    <div class="col-md-4 mb-3">
                        <h4>{{ $customer->wishlist_items_count }}</h4>
                        <p class="text-muted mb-0">Wishlist Items</p>
                    </div>
                    <div class="col-md-4 mb-3">
                        <h4>{{ $customer->notifications_count ?? 0 }}</h4>
                        <p class="text-muted mb-0">Notifications</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="fas fa-shopping-bag me-1"></i> Recent Orders</span>
                <a href="{{ route('admin.orders.index', ['search' => $customer->email_id]) }}" class="btn btn-sm btn-outline-primary">View All</a>
            </div>
            <div class="card-body">
                @if ($customer->orders->isEmpty())
                    <p class="text-muted mb-0">No orders yet.</p>
                @else
                    <div class="table-responsive">
                        <table class="table table-sm table-bordered align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th>Order #</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($customer->orders->take(5) as $order)
                                    <tr>
                                        <td><a href="{{ route('admin.orders.show', $order->id) }}">{{ $order->order_number }}</a></td>
                                        <td>₹{{ number_format($order->total, 2) }}</td>
                                        <td><span class="badge bg-secondary">{{ ucfirst($order->status) }}</span></td>
                                        <td>{{ $order->created_at->format('M d, Y') }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                @endif
            </div>
        </div>
    </div>
</div>

<div class="mt-4">
    <a href="{{ route('admin.customers.index') }}" class="btn btn-outline-secondary">Back to Customers</a>
</div>

@endsection
