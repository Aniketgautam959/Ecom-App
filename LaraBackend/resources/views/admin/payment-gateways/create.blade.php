@extends('layouts.admin')

@section('title', 'Create Payment Gateway')

@section('content')
<h1 class="mt-4">Create Payment Gateway</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item"><a href="{{ route('admin.payment-gateways.index') }}">Payment Gateways</a></li>
    <li class="breadcrumb-item active">Create</li>
</ol>

<div class="card mb-4">
    <div class="card-header"><i class="fas fa-credit-card me-1"></i> Payment Gateway Details</div>
    <div class="card-body">
        <form method="POST" action="{{ route('admin.payment-gateways.store') }}">
            @csrf
            @include('admin.payment-gateways._form', ['submitLabel' => 'Create'])
        </form>
    </div>
</div>
@endsection
