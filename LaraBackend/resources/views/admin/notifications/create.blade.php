@extends('layouts.admin')

@section('title', 'Create Notification')

@section('content')

<h1 class="mt-4">Create Notification</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item"><a href="{{ route('admin.notifications.index') }}">Notifications</a></li>
    <li class="breadcrumb-item active">Create</li>
</ol>

<div class="card mb-4">
    <div class="card-header">
        <i class="fas fa-bell me-1"></i> New Notification
    </div>
    <div class="card-body">
        <form method="POST" action="{{ route('admin.notifications.store') }}">
            @csrf
            @include('admin.notifications._form', ['submitLabel' => 'Send Notification'])
        </form>
    </div>
</div>

@endsection
