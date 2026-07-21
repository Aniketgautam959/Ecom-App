@csrf

@if ($banner->id ?? false)
    @method('PUT')
@endif

<div class="mb-3">
    <label for="title" class="form-label">Title</label>
    <input type="text" id="title" name="title" class="form-control @error('title') is-invalid @enderror"
           value="{{ old('title', $banner->title ?? '') }}" required>
    @error('title')
        <div class="invalid-feedback">{{ $message }}</div>
    @enderror
</div>

<div class="mb-3">
    <label for="subtitle" class="form-label">Subtitle</label>
    <input type="text" id="subtitle" name="subtitle" class="form-control @error('subtitle') is-invalid @enderror"
           value="{{ old('subtitle', $banner->subtitle ?? '') }}">
    @error('subtitle')
        <div class="invalid-feedback">{{ $message }}</div>
    @enderror
</div>

<div class="mb-3">
    <label for="image_file" class="form-label">Banner Image</label>
    @if (!empty($banner->image_url))
        <div class="mb-2">
            <img src="{{ $banner->image_url }}" alt="Current banner image"
                 class="img-thumbnail" style="max-height: 140px;">
        </div>
    @endif
    <input type="file" id="image_file" name="image_file"
           class="form-control @error('image_file') is-invalid @enderror"
           accept="image/jpeg,image/png,image/webp,image/gif">
    <div class="form-text">Upload a JPG, PNG, WEBP or GIF (max 5 MB). Leave empty to keep the current image.</div>
    @error('image_file')
        <div class="invalid-feedback">{{ $message }}</div>
    @enderror
</div>

<div class="mb-3">
    <label for="image" class="form-label">Or Image URL</label>
    <input type="text" id="image" name="image" class="form-control @error('image') is-invalid @enderror"
           value="{{ old('image', $banner->getRawOriginal('image') ?? '') }}" placeholder="https://...">
    <div class="form-text">Optional. Used only when no file is uploaded above.</div>
    @error('image')
        <div class="invalid-feedback">{{ $message }}</div>
    @enderror
</div>

<div class="mb-3">
    <label for="link" class="form-label">Link URL</label>
    <input type="text" id="link" name="link" class="form-control @error('link') is-invalid @enderror"
           value="{{ old('link', $banner->link ?? '') }}" placeholder="/products or https://...">
    @error('link')
        <div class="invalid-feedback">{{ $message }}</div>
    @enderror
</div>

<div class="mb-3">
    <label for="button_text" class="form-label">Button Text</label>
    <input type="text" id="button_text" name="button_text" class="form-control @error('button_text') is-invalid @enderror"
           value="{{ old('button_text', $banner->button_text ?? '') }}">
    @error('button_text')
        <div class="invalid-feedback">{{ $message }}</div>
    @enderror
</div>

<div class="mb-3">
    <label for="position" class="form-label">Position</label>
    <select id="position" name="position" class="form-select @error('position') is-invalid @enderror" required>
        <option value="home_hero" {{ old('position', $banner->position ?? '') === 'home_hero' ? 'selected' : '' }}>Home Hero</option>
        <option value="home_promo" {{ old('position', $banner->position ?? '') === 'home_promo' ? 'selected' : '' }}>Home Promo</option>
        <option value="home_bottom" {{ old('position', $banner->position ?? '') === 'home_bottom' ? 'selected' : '' }}>Home Bottom</option>
    </select>
    @error('position')
        <div class="invalid-feedback">{{ $message }}</div>
    @enderror
</div>

<div class="row mb-3">
    <div class="col-md-6">
        <label for="sort_order" class="form-label">Sort Order</label>
        <input type="number" id="sort_order" name="sort_order" class="form-control @error('sort_order') is-invalid @enderror"
               value="{{ old('sort_order', $banner->sort_order ?? 0) }}">
        @error('sort_order')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>
    <div class="col-md-6 d-flex align-items-center">
        <div class="form-check form-switch mt-4">
            <input type="checkbox" id="status" name="status" value="1" class="form-check-input"
                   {{ old('status', $banner->status ?? true) ? 'checked' : '' }}>
            <label class="form-check-label" for="status">Active</label>
        </div>
    </div>
</div>

<div class="d-flex gap-2">
    <button type="submit" class="btn btn-primary">{{ isset($banner) && $banner->id ? 'Update' : 'Create' }} Banner</button>
    <a href="{{ route('admin.banners.index') }}" class="btn btn-outline-secondary">Cancel</a>
</div>
