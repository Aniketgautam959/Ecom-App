@extends('layouts.admin')

@section('title', 'Edit Shipping Method')

@section('content')
<h1 class="mt-4">Edit Shipping Method</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item"><a href="{{ route('admin.shipping-methods.index') }}">Shipping Methods</a></li>
    <li class="breadcrumb-item active">Edit</li>
</ol>

<div class="card mb-4">
    <div class="card-header"><i class="fas fa-shipping-fast me-1"></i> Shipping Method Details</div>
    <div class="card-body">
        <form method="POST" action="{{ route('admin.shipping-methods.update', $method->id) }}">
            @csrf
            @method('PUT')
            @include('admin.shipping-methods._form', ['submitLabel' => 'Update'])
        </form>
    </div>
</div>
@endsection
