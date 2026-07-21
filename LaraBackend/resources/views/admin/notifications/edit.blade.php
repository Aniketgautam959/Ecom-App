@extends('layouts.admin')

@section('title', 'Edit Notification')

@section('content')

<h1 class="mt-4">Edit Notification</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item"><a href="{{ route('admin.notifications.index') }}">Notifications</a></li>
    <li class="breadcrumb-item active">Edit #{{ $notification->id }}</li>
</ol>

<div class="card mb-4">
    <div class="card-header">
        <i class="fas fa-bell me-1"></i> Edit Notification
    </div>
    <div class="card-body">
        <form method="POST" action="{{ route('admin.notifications.update', $notification) }}">
            @csrf
            @method('PUT')
            @include('admin.notifications._form', ['submitLabel' => 'Update Notification'])
        </form>
    </div>
</div>

@endsection
