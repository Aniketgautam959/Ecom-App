@extends('layouts.admin')

@section('title', 'Edit Role')

@section('content')
<h1 class="mt-4">Edit Role</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item"><a href="{{ route('admin.roles.index') }}">Roles & Permissions</a></li>
    <li class="breadcrumb-item active">Edit</li>
</ol>

<div class="card mb-4">
    <div class="card-header"><i class="fas fa-user-shield me-1"></i> Role Details</div>
    <div class="card-body">
        <form method="POST" action="{{ route('admin.roles.update', $role->id) }}">
            @csrf
            @method('PUT')
            @include('admin.roles._form', ['submitLabel' => 'Update'])
        </form>
    </div>
</div>
@endsection
