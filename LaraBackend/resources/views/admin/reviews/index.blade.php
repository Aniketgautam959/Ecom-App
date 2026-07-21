@extends('layouts.admin')

@section('title', 'Reviews')

@section('content')

<h1 class="mt-4">Reviews</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item active">Reviews</li>
</ol>

@if (session('success'))
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        {{ session('success') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
@endif

<div class="card mb-4">
    <div class="card-header d-flex justify-content-between align-items-center">
        <div><i class="fas fa-star me-1"></i> All Reviews</div>
    </div>
    <div class="card-body">
        <form method="GET" action="{{ route('admin.reviews.index') }}" class="row g-2 mb-3">
            <div class="col-md-8">
                <input type="text" name="search" value="{{ $search }}" class="form-control"
                       placeholder="Search by reviewer name, product, or comment...">
            </div>
            <div class="col-md-4 d-flex gap-2">
                <button type="submit" class="btn btn-outline-primary w-100">
                    <i class="fas fa-search me-1"></i> Search
                </button>
                <a href="{{ route('admin.reviews.index') }}" class="btn btn-outline-secondary">Reset</a>
            </div>
        </form>

        <div class="table-responsive">
            <table class="table table-bordered table-hover align-middle">
                <thead class="table-light">
                    <tr>
                        <th style="width:50px;">#</th>
                        <th>Reviewer</th>
                        <th>Product</th>
                        <th>Rating</th>
                        <th>Review</th>
                        <th>Status</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($reviews as $review)
                        <tr>
                            <td>{{ $review->id }}</td>
                            <td>
                                <div class="d-flex align-items-center gap-2">
                                    <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style="width:32px;height:32px;font-size:12px;font-weight:600;">
                                        {{ $review->initials }}
                                    </div>
                                    <div>
                                        <div class="fw-medium">{{ $review->reviewer_name }}</div>
                                        <small class="text-muted">{{ $review->user?->email_id }}</small>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="text-truncate d-inline-block" style="max-width:150px;">
                                    {{ $review->product?->name ?? '—' }}
                                </span>
                            </td>
                            <td>
                                @for ($i = 1; $i <= 5; $i++)
                                    <i class="fas fa-star {{ $i <= $review->rating ? 'text-warning' : 'text-muted' }}" style="font-size:12px;"></i>
                                @endfor
                            </td>
                            <td>
                                <span class="text-truncate d-inline-block" style="max-width:300px;">
                                    {{ $review->comment }}
                                </span>
                            </td>
                            <td>
                                <form method="POST" action="{{ route('admin.reviews.toggle-approval', $review->id) }}" class="d-inline">
                                    @csrf
                                    @method('PATCH')
                                    <button type="submit" class="btn btn-sm {{ $review->is_approved ? 'btn-success' : 'btn-warning' }}">
                                        {{ $review->is_approved ? 'Approved' : 'Pending' }}
                                    </button>
                                </form>
                            </td>
                            <td class="text-end">
                                <form method="POST" action="{{ route('admin.reviews.destroy', $review->id) }}" class="d-inline"
                                      onsubmit="return confirm('Delete this review?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-sm btn-outline-danger">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="text-center text-muted py-4">No reviews found.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">
                Showing {{ $reviews->firstItem() ?? 0 }}–{{ $reviews->lastItem() ?? 0 }}
                of {{ $reviews->total() }}
            </small>
            {{ $reviews->links() }}
        </div>
    </div>
</div>

@endsection
