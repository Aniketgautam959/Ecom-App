@extends('layouts.admin')

@section('title', 'Edit Coupon')

@section('content')

<h1 class="mt-4">Edit Coupon</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item"><a href="{{ route('admin.coupons.index') }}">Coupons</a></li>
    <li class="breadcrumb-item active">Edit #{{ $coupon->id }}</li>
</ol>

<div class="card mb-4">
    <div class="card-header">
        <i class="fas fa-ticket-alt me-1"></i> Edit Coupon
    </div>
    <div class="card-body">
        <form method="POST" action="{{ route('admin.coupons.update', $coupon) }}">
            @csrf
            @method('PUT')
            @include('admin.coupons._form', ['submitLabel' => 'Update Coupon'])
        </form>
    </div>
</div>

@endsection
