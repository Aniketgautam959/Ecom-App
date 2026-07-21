@extends('layouts.admin')

@section('title', 'Brands')

@section('content')

<h1 class="mt-4">Brands</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item active">Brands</li>
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
        <div><i class="fas fa-copyright me-1"></i> All Brands</div>
        <a href="{{ route('admin.brands.create') }}" class="btn btn-primary btn-sm">
            <i class="fas fa-plus me-1"></i> New Brand
        </a>
    </div>
    <div class="card-body">
        <form method="GET" action="{{ route('admin.brands.index') }}" class="row g-2 mb-3">
            <div class="col-md-6">
                <input type="text" name="search" value="{{ $search }}" class="form-control"
                       placeholder="Search by name or slug...">
            </div>
            <div class="col-md-3">
                <select name="status" class="form-select">
                    <option value="">All Status</option>
                    <option value="1" {{ $status === '1' ? 'selected' : '' }}>Enabled</option>
                    <option value="0" {{ $status === '0' ? 'selected' : '' }}>Disabled</option>
                </select>
            </div>
            <div class="col-md-3 d-flex gap-2">
                <button type="submit" class="btn btn-outline-primary w-100">
                    <i class="fas fa-search me-1"></i> Filter
                </button>
                <a href="{{ route('admin.brands.index') }}" class="btn btn-outline-secondary">Reset</a>
            </div>
        </form>

        <form method="POST" action="{{ route('admin.brands.bulk-action') }}"
              onsubmit="return confirm('Apply the selected bulk action?');">
            @csrf

            <div class="d-flex gap-2 mb-3">
                <select name="action" class="form-select w-auto">
                    <option value="">Bulk Actions</option>
                    <option value="enable">Enable</option>
                    <option value="disable">Disable</option>
                    <option value="delete">Delete</option>
                </select>
                <button type="submit" class="btn btn-outline-dark">Apply</button>
            </div>

            <div class="table-responsive">
                <table class="table table-bordered table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th style="width: 40px;">
                                <input type="checkbox" id="selectAll" class="form-check-input">
                            </th>
                            <th>#</th>
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Sort</th>
                            <th>Status</th>
                            <th class="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($brands as $brand)
                            <tr>
                                <td>
                                    <input type="checkbox" name="ids[]" value="{{ $brand->id }}"
                                           class="form-check-input row-check">
                                </td>
                                <td>{{ $brand->id }}</td>
                                <td>{{ $brand->name }}</td>
                                <td><code>{{ $brand->slug }}</code></td>
                                <td>{{ $brand->sort_order }}</td>
                                <td>
                                    <button type="submit" form="toggle-{{ $brand->id }}"
                                            class="btn btn-sm {{ $brand->status ? 'btn-success' : 'btn-secondary' }}">
                                        {{ $brand->status ? 'Enabled' : 'Disabled' }}
                                    </button>
                                </td>
                                <td class="text-end">
                                    <a href="{{ route('admin.brands.edit', $brand->id) }}" class="btn btn-sm btn-outline-primary">
                                        <i class="fas fa-pen"></i>
                                    </a>
                                    <button type="submit" form="delete-{{ $brand->id }}" class="btn btn-sm btn-outline-danger">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="7" class="text-center text-muted py-4">No brands found.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </form>

        {{-- Row-level action forms kept outside the bulk form to avoid nesting --}}
        @foreach ($brands as $brand)
            <form id="toggle-{{ $brand->id }}" method="POST"
                  action="{{ route('admin.brands.toggle-status', $brand->id) }}" class="d-none">
                @csrf
                @method('PATCH')
            </form>
            <form id="delete-{{ $brand->id }}" method="POST"
                  action="{{ route('admin.brands.destroy', $brand->id) }}" class="d-none"
                  onsubmit="return confirm('Delete this brand?');">
                @csrf
                @method('DELETE')
            </form>
        @endforeach

        <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">
                Showing {{ $brands->firstItem() ?? 0 }}–{{ $brands->lastItem() ?? 0 }}
                of {{ $brands->total() }}
            </small>
            {{ $brands->links() }}
        </div>
    </div>
</div>

<script>
    document.getElementById('selectAll')?.addEventListener('change', function () {
        document.querySelectorAll('.row-check').forEach(cb => cb.checked = this.checked);
    });
</script>

@endsection
