@extends('layouts.admin')

@section('title', 'Edit CMS Page')

@section('content')

<h1 class="mt-4">Edit CMS Page</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item"><a href="{{ route('admin.pages.index') }}">CMS Pages</a></li>
    <li class="breadcrumb-item active">Edit</li>
</ol>

<div class="card">
    <div class="card-header"><i class="fas fa-edit me-1"></i> {{ $page->title }}</div>
    <div class="card-body">
        <form method="POST" action="{{ route('admin.pages.update', $page) }}">
            @include('admin.pages._form', ['page' => $page])
        </form>
    </div>
</div>

@endsection
