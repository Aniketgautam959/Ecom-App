@extends('layouts.admin')

@section('title', 'Menus')

@section('content')

<h1 class="mt-4">Menus</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item active">Menus</li>
</ol>

@if (session('success'))
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        {{ session('success') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
@endif

<div class="card mb-4">
    <div class="card-header d-flex justify-content-between align-items-center">
        <span><i class="fas fa-bars me-1"></i> Menu Items</span>
        <a href="{{ route('admin.menus.create') }}" class="btn btn-sm btn-primary">
            <i class="fas fa-plus me-1"></i> Add Menu
        </a>
    </div>
    <div class="card-body">
        <form method="GET" action="{{ route('admin.menus.index') }}" class="row g-2 mb-3">
            <div class="col-md-6">
                <select name="position" class="form-select">
                    <option value="">All Positions</option>
                    <option value="header" {{ $position === 'header' ? 'selected' : '' }}>Header</option>
                    <option value="footer" {{ $position === 'footer' ? 'selected' : '' }}>Footer</option>
                </select>
            </div>
            <div class="col-md-3">
                <select name="status" class="form-select">
                    <option value="">All Status</option>
                    <option value="1" {{ $status === '1' ? 'selected' : '' }}>Active</option>
                    <option value="0" {{ $status === '0' ? 'selected' : '' }}>Inactive</option>
                </select>
            </div>
            <div class="col-md-3 d-flex gap-2">
                <button type="submit" class="btn btn-outline-primary w-100">
                    <i class="fas fa-search me-1"></i>
                </button>
                <a href="{{ route('admin.menus.index') }}" class="btn btn-outline-secondary">Reset</a>
            </div>
        </form>

        <div class="table-responsive">
            <table class="table table-bordered table-hover align-middle">
                <thead class="table-light">
                    <tr>
                        <th>Label</th>
                        <th>URL</th>
                        <th>Position</th>
                        <th>Sort</th>
                        <th>Status</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($menus as $menu)
                        <tr>
                            <td>{{ $menu->label }}</td>
                            <td><code>{{ $menu->url }}</code></td>
                            <td><span class="badge bg-secondary">{{ $menu->position }}</span></td>
                            <td>{{ $menu->sort_order }}</td>
                            <td>
                                <button type="submit" form="toggle-{{ $menu->id }}" class="btn btn-sm {{ $menu->status ? 'btn-success' : 'btn-secondary' }}">
                                    {{ $menu->status ? 'Active' : 'Inactive' }}
                                </button>
                            </td>
                            <td class="text-end">
                                <a href="{{ route('admin.menus.edit', $menu) }}" class="btn btn-sm btn-outline-primary">
                                    <i class="fas fa-edit"></i>
                                </a>
                                <button type="submit" form="delete-{{ $menu->id }}" class="btn btn-sm btn-outline-danger">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                        @foreach ($menu->children as $child)
                            <tr class="table-light">
                                <td class="ps-4">↳ {{ $child->label }}</td>
                                <td><code>{{ $child->url }}</code></td>
                                <td><span class="badge bg-secondary">{{ $child->position }}</span></td>
                                <td>{{ $child->sort_order }}</td>
                                <td>
                                    <button type="submit" form="toggle-{{ $child->id }}" class="btn btn-sm {{ $child->status ? 'btn-success' : 'btn-secondary' }}">
                                        {{ $child->status ? 'Active' : 'Inactive' }}
                                    </button>
                                </td>
                                <td class="text-end">
                                    <a href="{{ route('admin.menus.edit', $child) }}" class="btn btn-sm btn-outline-primary">
                                        <i class="fas fa-edit"></i>
                                    </a>
                                    <button type="submit" form="delete-{{ $child->id }}" class="btn btn-sm btn-outline-danger">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        @endforeach
                    @empty
                        <tr>
                            <td colspan="6" class="text-center text-muted py-4">No menu items found.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @foreach ($menus as $menu)
            <form id="toggle-{{ $menu->id }}" method="POST" action="{{ route('admin.menus.toggle-status', $menu) }}" class="d-none">
                @csrf
                @method('PATCH')
            </form>
            <form id="delete-{{ $menu->id }}" method="POST" action="{{ route('admin.menus.destroy', $menu) }}" class="d-none" onsubmit="return confirm('Delete this menu item?');">
                @csrf
                @method('DELETE')
            </form>
            @foreach ($menu->children as $child)
                <form id="toggle-{{ $child->id }}" method="POST" action="{{ route('admin.menus.toggle-status', $child) }}" class="d-none">
                    @csrf
                    @method('PATCH')
                </form>
                <form id="delete-{{ $child->id }}" method="POST" action="{{ route('admin.menus.destroy', $child) }}" class="d-none" onsubmit="return confirm('Delete this menu item?');">
                    @csrf
                    @method('DELETE')
                </form>
            @endforeach
        @endforeach

        <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">Showing {{ $menus->firstItem() ?? 0 }}–{{ $menus->lastItem() ?? 0 }} of {{ $menus->total() }}</small>
            {{ $menus->links() }}
        </div>
    </div>
</div>

@endsection
