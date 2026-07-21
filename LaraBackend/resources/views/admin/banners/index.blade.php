@extends('layouts.admin')

@section('title', 'Banners')

@section('content')

<h1 class="mt-4">Banners</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item active">Banners</li>
</ol>

@if (session('success'))
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        {{ session('success') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
@endif

<div class="card mb-4">
    <div class="card-header d-flex justify-content-between align-items-center">
        <span><i class="fas fa-images me-1"></i> All Banners</span>
        <a href="{{ route('admin.banners.create') }}" class="btn btn-sm btn-primary">
            <i class="fas fa-plus me-1"></i> Add Banner
        </a>
    </div>
    <div class="card-body">
        <form method="GET" action="{{ route('admin.banners.index') }}" class="row g-2 mb-3">
            <div class="col-md-4">
                <input type="text" name="search" value="{{ $search }}" class="form-control" placeholder="Search by title...">
            </div>
            <div class="col-md-3">
                <select name="position" class="form-select">
                    <option value="">All Positions</option>
                    <option value="home_hero" {{ $position === 'home_hero' ? 'selected' : '' }}>Home Hero</option>
                    <option value="home_promo" {{ $position === 'home_promo' ? 'selected' : '' }}>Home Promo</option>
                    <option value="home_bottom" {{ $position === 'home_bottom' ? 'selected' : '' }}>Home Bottom</option>
                </select>
            </div>
            <div class="col-md-3">
                <select name="status" class="form-select">
                    <option value="">All Status</option>
                    <option value="1" {{ $status === '1' ? 'selected' : '' }}>Active</option>
                    <option value="0" {{ $status === '0' ? 'selected' : '' }}>Inactive</option>
                </select>
            </div>
            <div class="col-md-2 d-flex gap-2">
                <button type="submit" class="btn btn-outline-primary w-100">
                    <i class="fas fa-search me-1"></i>
                </button>
                <a href="{{ route('admin.banners.index') }}" class="btn btn-outline-secondary">Reset</a>
            </div>
        </form>

        <div class="table-responsive">
            <table class="table table-bordered table-hover align-middle">
                <thead class="table-light">
                    <tr>
                        <th style="width: 90px;">Image</th>
                        <th>Title</th>
                        <th>Position</th>
                        <th>Sort</th>
                        <th>Status</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($banners as $banner)
                        <tr>
                            <td>
                                @if ($banner->image_url)
                                    <img src="{{ $banner->image_url }}" alt="{{ $banner->title }}"
                                         class="img-thumbnail" style="width: 70px; height: 45px; object-fit: cover;">
                                @else
                                    <span class="text-muted small">—</span>
                                @endif
                            </td>
                            <td>{{ $banner->title }}</td>
                            <td><span class="badge bg-secondary">{{ $banner->position }}</span></td>
                            <td>{{ $banner->sort_order }}</td>
                            <td>
                                <button type="submit" form="toggle-{{ $banner->id }}" class="btn btn-sm {{ $banner->status ? 'btn-success' : 'btn-secondary' }}">
                                    {{ $banner->status ? 'Active' : 'Inactive' }}
                                </button>
                            </td>
                            <td class="text-end">
                                <a href="{{ route('admin.banners.edit', $banner) }}" class="btn btn-sm btn-outline-primary">
                                    <i class="fas fa-edit"></i>
                                </a>
                                <button type="submit" form="delete-{{ $banner->id }}" class="btn btn-sm btn-outline-danger">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="text-center text-muted py-4">No banners found.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @foreach ($banners as $banner)
            <form id="toggle-{{ $banner->id }}" method="POST" action="{{ route('admin.banners.toggle-status', $banner) }}" class="d-none">
                @csrf
                @method('PATCH')
            </form>
            <form id="delete-{{ $banner->id }}" method="POST" action="{{ route('admin.banners.destroy', $banner) }}" class="d-none" onsubmit="return confirm('Delete this banner?');">
                @csrf
                @method('DELETE')
            </form>
        @endforeach

        <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">Showing {{ $banners->firstItem() ?? 0 }}–{{ $banners->lastItem() ?? 0 }} of {{ $banners->total() }}</small>
            {{ $banners->links() }}
        </div>
    </div>
</div>

@endsection
