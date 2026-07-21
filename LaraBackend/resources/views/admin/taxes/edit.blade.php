@extends('layouts.admin')

@section('title', 'Edit Tax')

@section('content')
<h1 class="mt-4">Edit Tax</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item"><a href="{{ route('admin.taxes.index') }}">Taxes</a></li>
    <li class="breadcrumb-item active">Edit</li>
</ol>

<div class="card mb-4">
    <div class="card-header"><i class="fas fa-percent me-1"></i> Tax Details</div>
    <div class="card-body">
        <form method="POST" action="{{ route('admin.taxes.update', $tax->id) }}">
            @csrf
            @method('PUT')
            @include('admin.taxes._form', ['submitLabel' => 'Update'])
        </form>
    </div>
</div>
@endsection
