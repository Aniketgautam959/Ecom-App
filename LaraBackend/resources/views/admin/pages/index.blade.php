@extends('layouts.admin')

@section('title', 'CMS Pages')

@section('content')

<h1 class="mt-4">CMS Pages</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item active">CMS Pages</li>
</ol>

@if (session('success'))
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        {{ session('success') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
@endif

<div class="card mb-4">
    <div class="card-header d-flex justify-content-between align-items-center">
        <span><i class="fas fa-file-alt me-1"></i> All Pages</span>
        <a href="{{ route('admin.pages.create') }}" class="btn btn-sm btn-primary">
            <i class="fas fa-plus me-1"></i> Add Page
        </a>
    </div>
    <div class="card-body">
        <form method="GET" action="{{ route('admin.pages.index') }}" class="row g-2 mb-3">
            <div class="col-md-6">
                <input type="text" name="search" value="{{ $search }}" class="form-control" placeholder="Search by title or slug...">
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
                    <i class="fas fa-search me-1"></i> Filter
                </button>
                <a href="{{ route('admin.pages.index') }}" class="btn btn-outline-secondary">Reset</a>
            </div>
        </form>

        <div class="table-responsive">
            <table class="table table-bordered table-hover align-middle">
                <thead class="table-light">
                    <tr>
                        <th>Title</th>
                        <th>Slug</th>
                        <th>Sort</th>
                        <th>Status</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($pages as $page)
                        <tr>
                            <td>{{ $page->title }}</td>
                            <td><code>{{ $page->slug }}</code></td>
                            <td>{{ $page->sort_order }}</td>
                            <td>
                                <button type="submit" form="toggle-{{ $page->id }}" class="btn btn-sm {{ $page->status ? 'btn-success' : 'btn-secondary' }}">
                                    {{ $page->status ? 'Active' : 'Inactive' }}
                                </button>
                            </td>
                            <td class="text-end">
                                <a href="{{ route('admin.pages.edit', $page) }}" class="btn btn-sm btn-outline-primary">
                                    <i class="fas fa-edit"></i>
                                </a>
                                <button type="submit" form="delete-{{ $page->id }}" class="btn btn-sm btn-outline-danger">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="text-center text-muted py-4">No pages found.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @foreach ($pages as $page)
            <form id="toggle-{{ $page->id }}" method="POST" action="{{ route('admin.pages.toggle-status', $page) }}" class="d-none">
                @csrf
                @method('PATCH')
            </form>
            <form id="delete-{{ $page->id }}" method="POST" action="{{ route('admin.pages.destroy', $page) }}" class="d-none" onsubmit="return confirm('Delete this page?');">
                @csrf
                @method('DELETE')
            </form>
        @endforeach

        <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">Showing {{ $pages->firstItem() ?? 0 }}–{{ $pages->lastItem() ?? 0 }} of {{ $pages->total() }}</small>
            {{ $pages->links() }}
        </div>
    </div>
</div>

@endsection
