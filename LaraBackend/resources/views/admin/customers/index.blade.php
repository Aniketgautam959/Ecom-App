@extends('layouts.admin')

@section('title', 'Customers')

@section('content')

<h1 class="mt-4">Customers</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item active">Customers</li>
</ol>

@if (session('success'))
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        {{ session('success') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
@endif

<div class="card mb-4">
    <div class="card-header">
        <i class="fas fa-users me-1"></i> All Customers
    </div>
    <div class="card-body">
        <form method="GET" action="{{ route('admin.customers.index') }}" class="row g-2 mb-3">
            <div class="col-md-6">
                <input type="text" name="search" value="{{ $search }}" class="form-control"
                       placeholder="Search by name, email or phone...">
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
                <a href="{{ route('admin.customers.index') }}" class="btn btn-outline-secondary">Reset</a>
            </div>
        </form>

        <div class="table-responsive">
            <table class="table table-bordered table-hover align-middle">
                <thead class="table-light">
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Orders</th>
                        <th>Joined</th>
                        <th>Status</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($customers as $customer)
                        <tr>
                            <td>{{ $customer->id }}</td>
                            <td>{{ $customer->first_name }} {{ $customer->last_name }}</td>
                            <td>{{ $customer->email_id }}</td>
                            <td>{{ $customer->phone_number ?? 'N/A' }}</td>
                            <td>
                                <a href="{{ route('admin.orders.index', ['search' => $customer->email_id]) }}" class="text-decoration-none">
                                    {{ $customer->orders_count ?? 0 }}
                                </a>
                            </td>
                            <td>{{ $customer->created_at->format('M d, Y') }}</td>
                            <td>
                                <button type="submit" form="toggle-{{ $customer->id }}"
                                        class="btn btn-sm {{ $customer->status ? 'btn-success' : 'btn-secondary' }}">
                                    {{ $customer->status ? 'Active' : 'Inactive' }}
                                </button>
                            </td>
                            <td class="text-end">
                                <a href="{{ route('admin.customers.show', $customer) }}" class="btn btn-sm btn-outline-primary">
                                    <i class="fas fa-eye"></i>
                                </a>
                                <button type="submit" form="delete-{{ $customer->id }}" class="btn btn-sm btn-outline-danger">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="8" class="text-center text-muted py-4">No customers found.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @foreach ($customers as $customer)
            <form id="toggle-{{ $customer->id }}" method="POST"
                  action="{{ route('admin.customers.toggle-status', $customer) }}" class="d-none">
                @csrf
                @method('PATCH')
            </form>
            <form id="delete-{{ $customer->id }}" method="POST"
                  action="{{ route('admin.customers.destroy', $customer) }}" class="d-none"
                  onsubmit="return confirm('Delete this customer?');">
                @csrf
                @method('DELETE')
            </form>
        @endforeach

        <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">
                Showing {{ $customers->firstItem() ?? 0 }}–{{ $customers->lastItem() ?? 0 }}
                of {{ $customers->total() }}
            </small>
            {{ $customers->links() }}
        </div>
    </div>
</div>

@endsection
