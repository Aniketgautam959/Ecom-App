@extends('layouts.admin')

@section('title', 'Notifications')

@section('content')

<h1 class="mt-4">Notifications</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item active">Notifications</li>
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
        <div><i class="fas fa-bell me-1"></i> All Notifications</div>
        <a href="{{ route('admin.notifications.create') }}" class="btn btn-primary btn-sm">
            <i class="fas fa-plus me-1"></i> New Notification
        </a>
    </div>
    <div class="card-body">
        <form method="GET" action="{{ route('admin.notifications.index') }}" class="row g-2 mb-3">
            <div class="col-md-3">
                <input type="text" name="search" value="{{ $search }}" class="form-control"
                       placeholder="Search title or message...">
            </div>
            <div class="col-md-2">
                <select name="type" class="form-select">
                    <option value="">All Types</option>
                    @foreach (['order', 'promo', 'system', 'payment', 'shipment', 'account'] as $t)
                        <option value="{{ $t }}" {{ $type === $t ? 'selected' : '' }}>{{ ucfirst($t) }}</option>
                    @endforeach
                </select>
            </div>
            <div class="col-md-2">
                <select name="read" class="form-select">
                    <option value="">All Read</option>
                    <option value="1" {{ $read === '1' ? 'selected' : '' }}>Read</option>
                    <option value="0" {{ $read === '0' ? 'selected' : '' }}>Unread</option>
                </select>
            </div>
            <div class="col-md-2">
                <select name="status" class="form-select">
                    <option value="">All Status</option>
                    <option value="1" {{ $status === '1' ? 'selected' : '' }}>Enabled</option>
                    <option value="0" {{ $status === '0' ? 'selected' : '' }}>Disabled</option>
                </select>
            </div>
            <div class="col-md-2">
                <select name="user_id" class="form-select">
                    <option value="">All Users</option>
                    @foreach ($users as $user)
                        <option value="{{ $user->id }}" {{ $user_id == $user->id ? 'selected' : '' }}>
                            {{ $user->first_name }} {{ $user->last_name }}
                        </option>
                    @endforeach
                </select>
            </div>
            <div class="col-md-1 d-flex gap-2">
                <button type="submit" class="btn btn-outline-primary w-100">
                    <i class="fas fa-search"></i>
                </button>
                <a href="{{ route('admin.notifications.index') }}" class="btn btn-outline-secondary">Reset</a>
            </div>
        </form>

        <form method="POST" action="{{ route('admin.notifications.bulk-action') }}"
              onsubmit="return confirm('Apply the selected bulk action?');">
            @csrf

            <div class="d-flex gap-2 mb-3">
                <select name="action" class="form-select w-auto" required>
                    <option value="">Bulk Actions</option>
                    <option value="read">Mark as Read</option>
                    <option value="unread">Mark as Unread</option>
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
                            <th>User</th>
                            <th>Type</th>
                            <th>Title</th>
                            <th>Message</th>
                            <th>Read</th>
                            <th>Status</th>
                            <th>Sent At</th>
                            <th class="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($notifications as $notification)
                            <tr>
                                <td>
                                    <input type="checkbox" name="ids[]" value="{{ $notification->id }}"
                                           class="form-check-input row-check">
                                </td>
                                <td>{{ $notification->id }}</td>
                                <td>
                                    @php
                                        $nUser = $notification->user;
                                        $nUserName = $nUser ? trim($nUser->first_name.' '.$nUser->last_name) : 'N/A';
                                    @endphp
                                    {{ $nUserName }}
                                </td>
                                <td><span class="badge bg-info text-dark">{{ ucfirst($notification->type) }}</span></td>
                                <td>{{ $notification->title }}</td>
                                <td class="text-truncate" style="max-width: 200px;" title="{{ $notification->message }}">
                                    {{ Str::limit($notification->message, 50) }}
                                </td>
                                <td>
                                    <span class="badge bg-{{ $notification->read ? 'success' : 'warning text-dark' }}">
                                        {{ $notification->read ? 'Read' : 'Unread' }}
                                    </span>
                                </td>
                                <td>
                                    <button type="submit" form="toggle-{{ $notification->id }}"
                                            class="btn btn-sm {{ $notification->status ? 'btn-success' : 'btn-secondary' }}">
                                        {{ $notification->status ? 'Enabled' : 'Disabled' }}
                                    </button>
                                </td>
                                <td>{{ $notification->created_at->format('M d, Y H:i') }}</td>
                                <td class="text-end">
                                    <a href="{{ route('admin.notifications.edit', $notification) }}" class="btn btn-sm btn-outline-primary">
                                        <i class="fas fa-pen"></i>
                                    </a>
                                    <button type="submit" form="delete-{{ $notification->id }}" class="btn btn-sm btn-outline-danger">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="10" class="text-center text-muted py-4">No notifications found.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </form>

        @foreach ($notifications as $notification)
            <form id="toggle-{{ $notification->id }}" method="POST"
                  action="{{ route('admin.notifications.toggle-status', $notification) }}" class="d-none">
                @csrf
                @method('PATCH')
            </form>
            <form id="delete-{{ $notification->id }}" method="POST"
                  action="{{ route('admin.notifications.destroy', $notification) }}" class="d-none"
                  onsubmit="return confirm('Delete this notification?');">
                @csrf
                @method('DELETE')
            </form>
        @endforeach

        <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">
                Showing {{ $notifications->firstItem() ?? 0 }}–{{ $notifications->lastItem() ?? 0 }}
                of {{ $notifications->total() }}
            </small>
            {{ $notifications->links() }}
        </div>
    </div>
</div>

<script>
    document.getElementById('selectAll')?.addEventListener('change', function () {
        document.querySelectorAll('.row-check').forEach(cb => cb.checked = this.checked);
    });
</script>

@endsection
