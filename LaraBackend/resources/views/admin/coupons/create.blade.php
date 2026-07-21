@extends('layouts.admin')

@section('title', 'Create Coupon')

@section('content')

<h1 class="mt-4">Create Coupon</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item"><a href="{{ route('admin.coupons.index') }}">Coupons</a></li>
    <li class="breadcrumb-item active">Create</li>
</ol>

<div class="card mb-4">
    <div class="card-header">
        <i class="fas fa-ticket-alt me-1"></i> New Coupon
    </div>
    <div class="card-body">
        <form method="POST" action="{{ route('admin.coupons.store') }}">
            @csrf
            @include('admin.coupons._form', ['submitLabel' => 'Create Coupon'])
        </form>
    </div>
</div>

@endsection
