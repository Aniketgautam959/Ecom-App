@extends('layouts.admin')

@section('title', 'Create Banner')

@section('content')

<h1 class="mt-4">Create Banner</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item"><a href="{{ route('admin.banners.index') }}">Banners</a></li>
    <li class="breadcrumb-item active">Create</li>
</ol>

<div class="card">
    <div class="card-header"><i class="fas fa-plus me-1"></i> New Banner</div>
    <div class="card-body">
        <form method="POST" action="{{ route('admin.banners.store') }}" enctype="multipart/form-data">
            @include('admin.banners._form', ['banner' => new \App\Models\Banner()])
        </form>
    </div>
</div>

@endsection
