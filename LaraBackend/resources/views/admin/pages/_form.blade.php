@csrf

@if ($page->id ?? false)
    @method('PUT')
@endif

<div class="mb-3">
    <label for="title" class="form-label">Title</label>
    <input type="text" id="title" name="title" class="form-control @error('title') is-invalid @enderror"
           value="{{ old('title', $page->title ?? '') }}" required>
    @error('title')
        <div class="invalid-feedback">{{ $message }}</div>
    @enderror
</div>

<div class="mb-3">
    <label for="slug" class="form-label">Slug</label>
    <input type="text" id="slug" name="slug" class="form-control @error('slug') is-invalid @enderror"
           value="{{ old('slug', $page->slug ?? '') }}" required>
    @error('slug')
        <div class="invalid-feedback">{{ $message }}</div>
    @enderror
</div>

<div class="mb-3">
    <label for="content" class="form-label">Content</label>
    <textarea id="content" name="content" rows="12" class="form-control @error('content') is-invalid @enderror" required>{{ old('content', $page->content ?? '') }}</textarea>
    @error('content')
        <div class="invalid-feedback">{{ $message }}</div>
    @enderror
</div>

<div class="mb-3">
    <label for="meta_title" class="form-label">Meta Title</label>
    <input type="text" id="meta_title" name="meta_title" class="form-control @error('meta_title') is-invalid @enderror"
           value="{{ old('meta_title', $page->meta_title ?? '') }}">
    @error('meta_title')
        <div class="invalid-feedback">{{ $message }}</div>
    @enderror
</div>

<div class="mb-3">
    <label for="meta_description" class="form-label">Meta Description</label>
    <textarea id="meta_description" name="meta_description" rows="3" class="form-control @error('meta_description') is-invalid @enderror">{{ old('meta_description', $page->meta_description ?? '') }}</textarea>
    @error('meta_description')
        <div class="invalid-feedback">{{ $message }}</div>
    @enderror
</div>

<div class="row mb-3">
    <div class="col-md-6">
        <label for="sort_order" class="form-label">Sort Order</label>
        <input type="number" id="sort_order" name="sort_order" class="form-control @error('sort_order') is-invalid @enderror"
               value="{{ old('sort_order', $page->sort_order ?? 0) }}">
        @error('sort_order')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>
    <div class="col-md-6 d-flex align-items-center">
        <div class="form-check form-switch mt-4">
            <input type="checkbox" id="status" name="status" value="1" class="form-check-input"
                   {{ old('status', $page->status ?? true) ? 'checked' : '' }}>
            <label class="form-check-label" for="status">Active</label>
        </div>
    </div>
</div>

<div class="d-flex gap-2">
    <button type="submit" class="btn btn-primary">{{ isset($page) && $page->id ? 'Update' : 'Create' }} Page</button>
    <a href="{{ route('admin.pages.index') }}" class="btn btn-outline-secondary">Cancel</a>
</div>
