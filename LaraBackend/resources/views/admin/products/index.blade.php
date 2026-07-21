@extends('layouts.admin')

@section('title', 'Products')

@section('content')
<div class="d-flex align-items-center justify-content-between mt-4 mb-3">
    <div>
        <h1 class="h4 mb-0">Products</h1>
        <ol class="breadcrumb mb-0 small">
            <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
            <li class="breadcrumb-item active">Products</li>
        </ol>
    </div>
    <a href="{{ route('admin.products.create') }}" class="btn btn-dark btn-sm">
        <i class="fas fa-plus me-1"></i> Add Product
    </a>
</div>

@if (session('success'))
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        {{ session('success') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
@endif
@if (session('error'))
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ session('error') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
@endif

{{-- Filters --}}
<div class="card mb-3">
    <div class="card-body py-2">
        <form method="GET" action="{{ route('admin.products.index') }}" class="row g-2 align-items-end">
            <div class="col-md-4">
                <input type="text" name="search" class="form-control form-control-sm"
                    placeholder="Search by name..." value="{{ $filters['search'] ?? '' }}">
            </div>
            <div class="col-md-2">
                <select name="status" class="form-select form-select-sm">
                    <option value="">All Status</option>
                    <option value="1" {{ ($filters['status'] ?? '') === '1' ? 'selected' : '' }}>Active</option>
                    <option value="0" {{ ($filters['status'] ?? '') === '0' ? 'selected' : '' }}>Inactive</option>
                </select>
            </div>
            <div class="col-md-2">
                <select name="category_id" class="form-select form-select-sm">
                    <option value="">All Categories</option>
                    @foreach ($categories as $cat)
                        <option value="{{ $cat->id }}" {{ ($filters['category_id'] ?? '') == $cat->id ? 'selected' : '' }}>
                            {{ $cat->name }}
                        </option>
                    @endforeach
                </select>
            </div>
            <div class="col-md-2">
                <select name="brand_id" class="form-select form-select-sm">
                    <option value="">All Brands</option>
                    @foreach ($brands as $brand)
                        <option value="{{ $brand->id }}" {{ ($filters['brand_id'] ?? '') == $brand->id ? 'selected' : '' }}>
                            {{ $brand->name }}
                        </option>
                    @endforeach
                </select>
            </div>
            <div class="col-md-2 d-flex gap-1">
                <button type="submit" class="btn btn-dark btn-sm">Filter</button>
                <a href="{{ route('admin.products.index') }}" class="btn btn-outline-secondary btn-sm">Reset</a>
            </div>
        </form>
    </div>
</div>

{{-- Bulk Action Form --}}
<form id="bulkForm" method="POST" action="{{ route('admin.products.bulk-action') }}">
    @csrf
    <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between py-2">
            <span class="small fw-semibold">{{ $products->total() }} product(s)</span>
            <div class="d-flex gap-2 align-items-center">
                <select name="action" class="form-select form-select-sm" style="width:140px;">
                    <option value="">Bulk Action</option>
                    <option value="enable">Enable</option>
                    <option value="disable">Disable</option>
                    <option value="delete">Delete</option>
                </select>
                <button type="button" class="btn btn-outline-dark btn-sm"
                    onclick="if(document.querySelector('select[name=action]').value){this.closest('form').submit();}else{alert('Select an action.');}">
                    Apply
                </button>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th width="40">
                                <input type="checkbox" id="selectAll" class="form-check-input">
                            </th>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Brand</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th width="120">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($products as $product)
                        <tr>
                            <td>
                                <input type="checkbox" name="product_ids[]" value="{{ $product->id }}" class="form-check-input row-check">
                            </td>
                            <td>
                                <div class="d-flex align-items-center gap-2">
                                    @if ($product->image)
                                        <img src="{{ $product->image }}" alt="{{ $product->name }}"
                                            class="rounded" style="width:36px;height:36px;object-fit:cover;">
                                    @else
                                        <div class="rounded bg-light d-flex align-items-center justify-content-center"
                                            style="width:36px;height:36px;">
                                            <i class="fas fa-image text-muted small"></i>
                                        </div>
                                    @endif
                                    <div>
                                        <div class="fw-medium small">{{ $product->name }}</div>
                                        <div class="text-muted" style="font-size:11px;">{{ $product->slug }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="small text-muted">{{ $product->category?->name ?? '—' }}</td>
                            <td class="small text-muted">{{ $product->brand?->name ?? '—' }}</td>
                            <td class="small fw-medium">@currency {{ number_format($product->price, 2) }}</td>
                            <td>
                                <form method="POST" action="{{ route('admin.products.toggle-status', $product->id) }}" class="d-inline">
                                    @csrf @method('PATCH')
                                    <button type="submit" class="badge border-0 {{ $product->status ? 'bg-success' : 'bg-secondary' }}"
                                        style="cursor:pointer;">
                                        {{ $product->status ? 'Active' : 'Inactive' }}
                                    </button>
                                </form>
                            </td>
                            <td>
                                <div class="d-flex gap-1">
                                    <a href="{{ route('admin.products.edit', $product->id) }}"
                                        class="btn btn-outline-primary btn-sm py-0 px-2" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </a>
                                    <form method="POST" action="{{ route('admin.products.destroy', $product->id) }}"
                                        onsubmit="return confirm('Delete this product?')">
                                        @csrf @method('DELETE')
                                        <button type="submit" class="btn btn-outline-danger btn-sm py-0 px-2" title="Delete">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="7" class="text-center text-muted py-4">No products found.</td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
        @if ($products->hasPages())
        <div class="card-footer">
            {{ $products->appends($filters)->links() }}
        </div>
        @endif
    </div>
</form>

@endsection

@push('scripts')
<script>
document.getElementById('selectAll').addEventListener('change', function () {
    document.querySelectorAll('.row-check').forEach(cb => cb.checked = this.checked);
});
</script>
@endpush
