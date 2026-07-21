@extends('layouts.admin')

@section('title', 'Shipping Methods')

@section('content')
<h1 class="mt-4">Shipping Methods</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item active">Shipping Methods</li>
</ol>

@if (session('success'))
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        {{ session('success') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
@endif

<div class="card mb-4">
    <div class="card-header d-flex justify-content-between align-items-center">
        <div><i class="fas fa-shipping-fast me-1"></i> All Shipping Methods</div>
        <a href="{{ route('admin.shipping-methods.create') }}" class="btn btn-primary btn-sm">
            <i class="fas fa-plus me-1"></i> New Method
        </a>
    </div>
    <div class="card-body">
        <form method="GET" action="{{ route('admin.shipping-methods.index') }}" class="row g-2 mb-3">
            <div class="col-md-6">
                <input type="text" name="search" value="{{ $search }}" class="form-control" placeholder="Search by name...">
            </div>
            <div class="col-md-3">
                <select name="status" class="form-select">
                    <option value="">All Status</option>
                    <option value="1" {{ $status === '1' ? 'selected' : '' }}>Active</option>
                    <option value="0" {{ $status === '0' ? 'selected' : '' }}>Inactive</option>
                </select>
            </div>
            <div class="col-md-3 d-flex gap-2">
                <button type="submit" class="btn btn-outline-primary w-100"><i class="fas fa-search me-1"></i> Filter</button>
                <a href="{{ route('admin.shipping-methods.index') }}" class="btn btn-outline-secondary">Reset</a>
            </div>
        </form>

        <form method="POST" action="{{ route('admin.shipping-methods.bulk-action') }}" id="bulkForm" class="mb-3">
            @csrf
            <div class="row g-2">
                <div class="col-auto">
                    <select name="action" class="form-select form-select-sm" required>
                        <option value="">Bulk Action</option>
                        <option value="enable">Enable</option>
                        <option value="disable">Disable</option>
                        <option value="delete">Delete</option>
                    </select>
                </div>
                <div class="col-auto">
                    <button type="submit" class="btn btn-sm btn-outline-dark" onclick="return confirm('Apply bulk action?');">Apply</button>
                </div>
            </div>

            <div class="table-responsive mt-3">
                <table class="table table-bordered table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th><input type="checkbox" id="selectAll"></th>
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Price</th>
                            <th>Free Threshold</th>
                            <th>Default</th>
                            <th>Status</th>
                            <th class="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($methods as $method)
                            <tr>
                                <td><input type="checkbox" name="ids[]" value="{{ $method->id }}" class="rowCheckbox"></td>
                                <td>{{ $method->name }}</td>
                                <td><code>{{ $method->slug }}</code></td>
                                <td>{{ number_format($method->price, 2) }}</td>
                                <td>{{ $method->free_threshold ? number_format($method->free_threshold, 2) : '—' }}</td>
                                <td>{{ $method->is_default ? 'Yes' : 'No' }}</td>
                                <td>
                                    <form method="POST" action="{{ route('admin.shipping-methods.toggle-status', $method->id) }}" class="d-inline">
                                        @csrf @method('PATCH')
                                        <button type="submit" class="btn btn-sm {{ $method->status ? 'btn-success' : 'btn-secondary' }}">
                                            {{ $method->status ? 'Active' : 'Inactive' }}
                                        </button>
                                    </form>
                                </td>
                                <td class="text-end">
                                    <a href="{{ route('admin.shipping-methods.edit', $method->id) }}" class="btn btn-sm btn-outline-primary"><i class="fas fa-pen"></i></a>
                                    <form method="POST" action="{{ route('admin.shipping-methods.destroy', $method->id) }}" class="d-inline" onsubmit="return confirm('Delete this method?');">
                                        @csrf @method('DELETE')
                                        <button type="submit" class="btn btn-sm btn-outline-danger"><i class="fas fa-trash"></i></button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr><td colspan="8" class="text-center text-muted py-4">No shipping methods found.</td></tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </form>

        <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">Showing {{ $methods->firstItem() ?? 0 }}–{{ $methods->lastItem() ?? 0 }} of {{ $methods->total() }}</small>
            {{ $methods->links() }}
        </div>
    </div>
</div>

<script>
    document.getElementById('selectAll').addEventListener('change', function () {
        document.querySelectorAll('.rowCheckbox').forEach(cb => cb.checked = this.checked);
    });
</script>
@endsection
