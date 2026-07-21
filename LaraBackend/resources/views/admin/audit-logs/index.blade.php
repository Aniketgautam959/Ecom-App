@extends('layouts.admin')

@section('title', 'Audit Logs')

@section('content')

<h1 class="mt-4">Audit Logs</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item active">Audit Logs</li>
</ol>

<div class="card mb-4">
    <div class="card-header">
        <i class="fas fa-history me-1"></i> Activity Logs
    </div>
    <div class="card-body">
        <form method="GET" action="{{ route('admin.audit-logs.index') }}" class="row g-2 mb-3">
            <div class="col-md-3">
                <select name="action" class="form-select">
                    <option value="">All Actions</option>
                    @foreach ($actions as $a)
                        <option value="{{ $a }}" {{ $action === $a ? 'selected' : '' }}>{{ ucfirst($a) }}</option>
                    @endforeach
                </select>
            </div>
            <div class="col-md-3">
                <select name="subject_type" class="form-select">
                    <option value="">All Types</option>
                    @foreach ($subjectTypes as $type)
                        <option value="{{ $type }}" {{ $subject_type === $type ? 'selected' : '' }}>{{ ucfirst($type) }}</option>
                    @endforeach
                </select>
            </div>
            <div class="col-md-4">
                <input type="text" name="search" value="{{ $search }}" class="form-control" placeholder="Search description...">
            </div>
            <div class="col-md-2 d-flex gap-2">
                <button type="submit" class="btn btn-outline-primary w-100">
                    <i class="fas fa-search me-1"></i> Filter
                </button>
                <a href="{{ route('admin.audit-logs.index') }}" class="btn btn-outline-secondary">Reset</a>
            </div>
        </form>

        <div class="table-responsive">
            <table class="table table-bordered table-hover align-middle">
                <thead class="table-light">
                    <tr>
                        <th>Time</th>
                        <th>User</th>
                        <th>Action</th>
                        <th>Type</th>
                        <th>ID</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($logs as $log)
                        <tr>
                            <td nowrap>{{ $log->created_at->format('M d, Y H:i:s') }}</td>
                            <td>{{ $log->causer?->first_name ?? 'System' }}</td>
                            <td><span class="badge bg-secondary">{{ ucfirst($log->action) }}</span></td>
                            <td>{{ ucfirst($log->subject_type) }}</td>
                            <td>{{ $log->subject_id ?? '—' }}</td>
                            <td>{{ $log->description }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="text-center text-muted py-4">No audit logs found.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">Showing {{ $logs->firstItem() ?? 0 }}–{{ $logs->lastItem() ?? 0 }} of {{ $logs->total() }}</small>
            {{ $logs->links() }}
        </div>
    </div>
</div>

@endsection
