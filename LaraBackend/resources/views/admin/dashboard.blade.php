@extends('layouts.admin')

@section('title', 'Dashboard')

@section('content')

<div class="d-flex align-items-center justify-content-between mt-4 mb-4">
    <div>
        <h1 class="h4 mb-0">Dashboard</h1>
        <ol class="breadcrumb mb-0 small">
            <li class="breadcrumb-item active">Overview</li>
        </ol>
    </div>
</div>

{{-- Stat Cards --}}
<div class="row g-3 mb-4">

    <div class="col-sm-6 col-lg-3">
        <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
                <p class="text-muted small mb-1 text-uppercase fw-semibold" style="font-size:11px;letter-spacing:.5px;">Total Products</p>
                <h3 class="fw-bold mb-0">{{ number_format($totalProducts) }}</h3>
                <p class="text-muted small mt-1 mb-0">{{ $activeProducts }} active</p>
            </div>
            <div class="card-footer bg-transparent border-0 pt-0 pb-2 px-3">
                <a href="{{ route('admin.products.index') }}" class="small text-decoration-none text-primary">View all →</a>
            </div>
        </div>
    </div>

    <div class="col-sm-6 col-lg-3">
        <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
                <p class="text-muted small mb-1 text-uppercase fw-semibold" style="font-size:11px;letter-spacing:.5px;">Categories</p>
                <h3 class="fw-bold mb-0">{{ number_format($totalCategories) }}</h3>
                <p class="text-muted small mt-1 mb-0">&nbsp;</p>
            </div>
            <div class="card-footer bg-transparent border-0 pt-0 pb-2 px-3">
                <a href="{{ route('admin.categories.index') }}" class="small text-decoration-none text-primary">View all →</a>
            </div>
        </div>
    </div>

    <div class="col-sm-6 col-lg-3">
        <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
                <p class="text-muted small mb-1 text-uppercase fw-semibold" style="font-size:11px;letter-spacing:.5px;">Brands</p>
                <h3 class="fw-bold mb-0">{{ number_format($totalBrands) }}</h3>
                <p class="text-muted small mt-1 mb-0">&nbsp;</p>
            </div>
            <div class="card-footer bg-transparent border-0 pt-0 pb-2 px-3">
                <a href="{{ route('admin.brands.index') }}" class="small text-decoration-none text-primary">View all →</a>
            </div>
        </div>
    </div>

    <div class="col-sm-6 col-lg-3">
        <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
                <p class="text-muted small mb-1 text-uppercase fw-semibold" style="font-size:11px;letter-spacing:.5px;">Customers</p>
                <h3 class="fw-bold mb-0">{{ number_format($totalUsers) }}</h3>
                <p class="text-muted small mt-1 mb-0">Registered users</p>
            </div>
            <div class="card-footer bg-transparent border-0 pt-0 pb-2 px-3">
                <span class="small text-muted">Total</span>
            </div>
        </div>
    </div>

</div>

{{-- Latest Products --}}
<div class="card border-0 shadow-sm">
    <div class="card-header bg-white border-bottom d-flex align-items-center justify-content-between py-3">
        <span class="fw-semibold">Latest Products</span>
        <a href="{{ route('admin.products.index') }}" class="small text-decoration-none text-primary">View all →</a>
    </div>

    @if ($latestProducts->isEmpty())
        <div class="card-body text-center text-muted py-5">
            <i class="fas fa-box fa-2x mb-3 d-block opacity-25"></i>
            No products yet. <a href="{{ route('admin.products.create') }}">Add your first product</a>.
        </div>
    @else
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Brand</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Added</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($latestProducts as $product)
                    <tr>
                        <td>
                            <div class="d-flex align-items-center gap-2">
                                @if ($product->image)
                                    <img src="{{ $product->image }}" alt="{{ $product->name }}"
                                        class="rounded" style="width:34px;height:34px;object-fit:cover;">
                                @else
                                    <div class="rounded bg-light d-flex align-items-center justify-content-center"
                                        style="width:34px;height:34px;">
                                        <i class="fas fa-image text-muted" style="font-size:11px;"></i>
                                    </div>
                                @endif
                                <span class="fw-medium small">{{ $product->name }}</span>
                            </div>
                        </td>
                        <td class="small text-muted">{{ $product->category?->name ?? '—' }}</td>
                        <td class="small text-muted">{{ $product->brand?->name ?? '—' }}</td>
                        <td class="small fw-medium">@currency {{ number_format($product->price, 2) }}</td>
                        <td>
                            <span class="badge {{ $product->status ? 'bg-success' : 'bg-secondary' }}">
                                {{ $product->status ? 'Active' : 'Inactive' }}
                            </span>
                        </td>
                        <td class="small text-muted">{{ $product->created_at->diffForHumans() }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif
</div>

@endsection
