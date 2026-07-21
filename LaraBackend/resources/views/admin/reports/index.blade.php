@extends('layouts.admin')

@section('title', 'Reports')

@section('content')

<h1 class="mt-4">Reports</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item active">Reports</li>
</ol>

<div class="card mb-4">
    <div class="card-header"><i class="fas fa-calendar-alt me-1"></i> Date Range</div>
    <div class="card-body">
        <form method="GET" action="{{ route('admin.reports.index') }}" class="row g-2">
            <div class="col-md-4">
                <input type="date" name="start" value="{{ $start }}" class="form-control">
            </div>
            <div class="col-md-4">
                <input type="date" name="end" value="{{ $end }}" class="form-control">
            </div>
            <div class="col-md-4">
                <button type="submit" class="btn btn-primary w-100">
                    <i class="fas fa-filter me-1"></i> Generate Report
                </button>
            </div>
        </form>
    </div>
</div>

<div class="row mb-4">
    <div class="col-md-3">
        <div class="card bg-primary text-white">
            <div class="card-body">
                <h5>₹{{ number_format($totalSales, 2) }}</h5>
                <p class="mb-0">Total Sales</p>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card bg-success text-white">
            <div class="card-body">
                <h5>{{ $totalOrders }}</h5>
                <p class="mb-0">Total Orders</p>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card bg-info text-white">
            <div class="card-body">
                <h5>₹{{ number_format($averageOrderValue, 2) }}</h5>
                <p class="mb-0">Average Order Value</p>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card bg-warning text-white">
            <div class="card-body">
                <h5>{{ $newCustomers }}</h5>
                <p class="mb-0">New Customers</p>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-8">
        <div class="card mb-4">
            <div class="card-header"><i class="fas fa-chart-line me-1"></i> Sales Over Time</div>
            <div class="card-body">
                @if ($salesChart->isEmpty())
                    <p class="text-muted mb-0">No sales data for selected period.</p>
                @else
                    <div class="table-responsive">
                        <table class="table table-sm table-bordered">
                            <thead class="table-light">
                                <tr>
                                    <th>Date</th>
                                    <th class="text-end">Sales</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($salesChart as $row)
                                    <tr>
                                        <td>{{ $row->date }}</td>
                                        <td class="text-end">₹{{ number_format($row->total, 2) }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                @endif
            </div>
        </div>
    </div>

    <div class="col-md-4">
        <div class="card mb-4">
            <div class="card-header"><i class="fas fa-tasks me-1"></i> Order Status</div>
            <div class="card-body">
                @if ($statusCounts->isEmpty())
                    <p class="text-muted mb-0">No orders.</p>
                @else
                    <ul class="list-group list-group-flush">
                        @foreach ($statusCounts as $status => $count)
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                {{ ucfirst($status) }}
                                <span class="badge bg-primary rounded-pill">{{ $count }}</span>
                            </li>
                        @endforeach
                    </ul>
                @endif
            </div>
        </div>
    </div>
</div>

<div class="card">
    <div class="card-header"><i class="fas fa-crown me-1"></i> Top Selling Products</div>
    <div class="card-body">
        @if ($topProducts->isEmpty())
            <p class="text-muted mb-0">No product sales data.</p>
        @else
            <div class="table-responsive">
                <table class="table table-bordered table-hover">
                    <thead class="table-light">
                        <tr>
                            <th>Product</th>
                            <th class="text-end">Qty Sold</th>
                            <th class="text-end">Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($topProducts as $product)
                            <tr>
                                <td>{{ $product->product_name }}</td>
                                <td class="text-end">{{ $product->qty }}</td>
                                <td class="text-end">₹{{ number_format($product->revenue, 2) }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </div>
</div>

@endsection
