@extends('layouts.admin')

@section('title', 'Create Tax')

@section('content')
<h1 class="mt-4">Create Tax</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item"><a href="{{ route('admin.taxes.index') }}">Taxes</a></li>
    <li class="breadcrumb-item active">Create</li>
</ol>

<div class="card mb-4">
    <div class="card-header"><i class="fas fa-percent me-1"></i> Tax Details</div>
    <div class="card-body">
        <form method="POST" action="{{ route('admin.taxes.store') }}">
            @csrf
            @include('admin.taxes._form', ['submitLabel' => 'Create'])
        </form>
    </div>
</div>
@endsection
