@extends('layouts.admin')

@section('title', 'Edit Brand')

@section('content')

<h1 class="mt-4">Edit Brand</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item"><a href="{{ route('admin.brands.index') }}">Brands</a></li>
    <li class="breadcrumb-item active">Edit</li>
</ol>

<div class="card mb-4">
    <div class="card-body">
        <form method="POST" action="{{ route('admin.brands.update', $brand->id) }}">
            @csrf
            @method('PUT')
            @include('admin.brands._form', ['submitLabel' => 'Update Brand'])
        </form>
    </div>
</div>

@endsection
