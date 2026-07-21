@extends('layouts.admin')

@section('title', 'Edit Banner')

@section('content')

<h1 class="mt-4">Edit Banner</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item"><a href="{{ route('admin.banners.index') }}">Banners</a></li>
    <li class="breadcrumb-item active">Edit</li>
</ol>

<div class="card">
    <div class="card-header"><i class="fas fa-edit me-1"></i> {{ $banner->title }}</div>
    <div class="card-body">
        <form method="POST" action="{{ route('admin.banners.update', $banner) }}" enctype="multipart/form-data">
            @include('admin.banners._form', ['banner' => $banner])
        </form>
    </div>
</div>

@endsection
