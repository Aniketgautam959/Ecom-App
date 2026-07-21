@extends('layouts.admin')

@section('title', 'Edit Menu Item')

@section('content')

<h1 class="mt-4">Edit Menu Item</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item"><a href="{{ route('admin.menus.index') }}">Menus</a></li>
    <li class="breadcrumb-item active">Edit</li>
</ol>

<div class="card">
    <div class="card-header"><i class="fas fa-edit me-1"></i> {{ $menu->label }}</div>
    <div class="card-body">
        <form method="POST" action="{{ route('admin.menus.update', $menu) }}">
            @include('admin.menus._form', ['menu' => $menu])
        </form>
    </div>
</div>

@endsection
