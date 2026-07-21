@extends('layouts.admin')

@section('title', 'Create Menu Item')

@section('content')

<h1 class="mt-4">Create Menu Item</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item"><a href="{{ route('admin.menus.index') }}">Menus</a></li>
    <li class="breadcrumb-item active">Create</li>
</ol>

<div class="card">
    <div class="card-header"><i class="fas fa-plus me-1"></i> New Menu Item</div>
    <div class="card-body">
        <form method="POST" action="{{ route('admin.menus.store') }}">
            @include('admin.menus._form', ['menu' => new \App\Models\Menu()])
        </form>
    </div>
</div>

@endsection
