@extends('layouts.admin')

@section('title', 'Create Brand')

@section('content')

<h1 class="mt-4">Create Brand</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item"><a href="{{ route('admin.brands.index') }}">Brands</a></li>
    <li class="breadcrumb-item active">Create</li>
</ol>

<div class="card mb-4">
    <div class="card-body">
        <form method="POST" action="{{ route('admin.brands.store') }}">
            @csrf
            @include('admin.brands._form', ['submitLabel' => 'Create Brand'])
        </form>
    </div>
</div>

@endsection
