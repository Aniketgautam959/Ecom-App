@extends('layouts.admin')

@section('title', 'Create CMS Page')

@section('content')

<h1 class="mt-4">Create CMS Page</h1>
<ol class="breadcrumb mb-4">
    <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Dashboard</a></li>
    <li class="breadcrumb-item"><a href="{{ route('admin.pages.index') }}">CMS Pages</a></li>
    <li class="breadcrumb-item active">Create</li>
</ol>

<div class="card">
    <div class="card-header"><i class="fas fa-plus me-1"></i> New Page</div>
    <div class="card-body">
        <form method="POST" action="{{ route('admin.pages.store') }}">
            @include('admin.pages._form', ['page' => new \App\Models\Page()])
        </form>
    </div>
</div>

@endsection
