@extends('layouts.admin')

@section('title', 'Coupons')

@section('content')

<h1 class="mt-4">Coupons</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item active">Coupons</li>
</ol>

@if (session('success'))
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        {{ session('success') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
@endif

@if ($errors->any())
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        @foreach ($errors->all() as $error)
            <div>{{ $error }}</div>
        @endforeach
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
@endif

<div class="card mb-4">
    <div class="card-header d-flex justify-content-between align-items-center">
        <div><i class="fas fa-ticket-alt me-1"></i> All Coupons</div>
        <a href="{{ route('admin.coupons.create') }}" class="btn btn-primary btn-sm">
            <i class="fas fa-plus me-1"></i> New Coupon
        </a>
    </div>
    <div class="card-body">
        <form method="GET" action="{{ route('admin.coupons.index') }}" class="row g-2 mb-3">
            <div class="col-md-5">
                <input type="text" name="search" value="{{ $search }}" class="form-control"
                       placeholder="Search by code...">
            </div>
            <div class="col-md-3">
                <select name="type" class="form-select">
                    <option value="">All Types</option>
                    <option value="percentage" {{ $type === 'percentage' ? 'selected' : '' }}>Percentage</option>
                    <option value="fixed" {{ $type === 'fixed' ? 'selected' : '' }}>Fixed</option>
                </select>
            </div>
            <div class="col-md-2">
                <select name="status" class="form-select">
                    <option value="">All Status</option>
                    <option value="1" {{ $status === '1' ? 'selected' : '' }}>Enabled</option>
                    <option value="0" {{ $status === '0' ? 'selected' : '' }}>Disabled</option>
                </select>
            </div>
            <div class="col-md-2 d-flex gap-2">
                <button type="submit" class="btn btn-outline-primary w-100">
                    <i class="fas fa-search me-1"></i> Filter
                </button>
                <a href="{{ route('admin.coupons.index') }}" class="btn btn-outline-secondary">Reset</a>
            </div>
        </form>

        <div class="table-responsive">
            <table class="table table-bordered table-hover align-middle">
                <thead class="table-light">
                    <tr>
                        <th>#</th>
                        <th>Code</th>
                        <th>Type</th>
                        <th>Value</th>
                        <th>Min Order</th>
                        <th>Usage</th>
                        <th>Validity</th>
                        <th>Status</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($coupons as $coupon)
                        <tr>
                            <td>{{ $coupon->id }}</td>
                            <td><code>{{ $coupon->code }}</code></td>
                            <td>{{ ucfirst($coupon->type) }}</td>
                            <td>
                                @if ($coupon->type === 'percentage')
                                    {{ $coupon->value }}%
                                @else
                                    ₹{{ number_format($coupon->value, 2) }}
                                @endif
                            </td>
                            <td>₹{{ number_format($coupon->min_order_amount, 2) }}</td>
                            <td>
                                {{ $coupon->usage_count }}
                                @if ($coupon->usage_limit)
                                    / {{ $coupon->usage_limit }}
                                @endif
                            </td>
                            <td>
                                @if ($coupon->starts_at)
                                    {{ $coupon->starts_at->format('M d, Y') }} -
                                @endif
                                @if ($coupon->expires_at)
                                    {{ $coupon->expires_at->format('M d, Y') }}
                                @else
                                    No expiry
                                @endif
                            </td>
                            <td>
                                <button type="submit" form="toggle-{{ $coupon->id }}"
                                        class="btn btn-sm {{ $coupon->status ? 'btn-success' : 'btn-secondary' }}">
                                    {{ $coupon->status ? 'Enabled' : 'Disabled' }}
                                </button>
                            </td>
                            <td class="text-end">
                                <a href="{{ route('admin.coupons.edit', $coupon) }}" class="btn btn-sm btn-outline-primary">
                                    <i class="fas fa-pen"></i>
                                </a>
                                <button type="submit" form="delete-{{ $coupon->id }}" class="btn btn-sm btn-outline-danger">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="9" class="text-center text-muted py-4">No coupons found.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @foreach ($coupons as $coupon)
            <form id="toggle-{{ $coupon->id }}" method="POST"
                  action="{{ route('admin.coupons.toggle-status', $coupon) }}" class="d-none">
                @csrf
                @method('PATCH')
            </form>
            <form id="delete-{{ $coupon->id }}" method="POST"
                  action="{{ route('admin.coupons.destroy', $coupon) }}" class="d-none"
                  onsubmit="return confirm('Delete this coupon?');">
                @csrf
                @method('DELETE')
            </form>
        @endforeach

        <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">
                Showing {{ $coupons->firstItem() ?? 0 }}–{{ $coupons->lastItem() ?? 0 }}
                of {{ $coupons->total() }}
            </small>
            {{ $coupons->links() }}
        </div>
    </div>
</div>

@endsection
