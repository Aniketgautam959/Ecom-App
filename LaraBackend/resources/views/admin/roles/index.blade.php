@extends('layouts.admin')

@section('title', 'Roles & Permissions')

@section('content')
<h1 class="mt-4">Roles & Permissions</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item active">Roles & Permissions</li>
</ol>

@if (session('success'))
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        {{ session('success') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
@endif

<div class="card mb-4">
    <div class="card-header d-flex justify-content-between align-items-center">
        <div><i class="fas fa-user-shield me-1"></i> All Roles</div>
        <a href="{{ route('admin.roles.create') }}" class="btn btn-primary btn-sm">
            <i class="fas fa-plus me-1"></i> New Role
        </a>
    </div>
    <div class="card-body">
        <form method="GET" action="{{ route('admin.roles.index') }}" class="row g-2 mb-3">
            <div class="col-md-6">
                <input type="text" name="search" value="{{ $search }}" class="form-control" placeholder="Search by name or slug...">
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
                <a href="{{ route('admin.roles.index') }}" class="btn btn-outline-secondary">Reset</a>
            </div>
        </form>

        <form method="POST" action="{{ route('admin.roles.bulk-action') }}" id="bulkForm" class="mb-3">
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
                            <th>Permissions</th>
                            <th>Status</th>
                            <th class="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($roles as $role)
                            <tr>
                                <td><input type="checkbox" name="ids[]" value="{{ $role->id }}" class="rowCheckbox"></td>
                                <td>{{ $role->name }}</td>
                                <td><code>{{ $role->slug }}</code></td>
                                <td>{{ count($role->permissions ?? []) }} granted</td>
                                <td>
                                    <form method="POST" action="{{ route('admin.roles.toggle-status', $role->id) }}" class="d-inline">
                                        @csrf @method('PATCH')
                                        <button type="submit" class="btn btn-sm {{ $role->status ? 'btn-success' : 'btn-secondary' }}">
                                            {{ $role->status ? 'Active' : 'Inactive' }}
                                        </button>
                                    </form>
                                </td>
                                <td class="text-end">
                                    <a href="{{ route('admin.roles.edit', $role->id) }}" class="btn btn-sm btn-outline-primary"><i class="fas fa-pen"></i></a>
                                    <form method="POST" action="{{ route('admin.roles.destroy', $role->id) }}" class="d-inline" onsubmit="return confirm('Delete this role?');">
                                        @csrf @method('DELETE')
                                        <button type="submit" class="btn btn-sm btn-outline-danger"><i class="fas fa-trash"></i></button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr><td colspan="6" class="text-center text-muted py-4">No roles found.</td></tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </form>

        <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">Showing {{ $roles->firstItem() ?? 0 }}–{{ $roles->lastItem() ?? 0 }} of {{ $roles->total() }}</small>
            {{ $roles->links() }}
        </div>
    </div>
</div>

<script>
    document.getElementById('selectAll').addEventListener('change', function () {
        document.querySelectorAll('.rowCheckbox').forEach(cb => cb.checked = this.checked);
    });
</script>
@endsection
