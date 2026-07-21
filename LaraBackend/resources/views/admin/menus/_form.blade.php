@csrf

@if ($menu->id ?? false)
    @method('PUT')
@endif

<div class="mb-3">
    <label for="label" class="form-label">Label</label>
    <input type="text" id="label" name="label" class="form-control @error('label') is-invalid @enderror"
           value="{{ old('label', $menu->label ?? '') }}" required>
    @error('label')
        <div class="invalid-feedback">{{ $message }}</div>
    @enderror
</div>

<div class="mb-3">
    <label for="url" class="form-label">URL</label>
    <input type="text" id="url" name="url" class="form-control @error('url') is-invalid @enderror"
           value="{{ old('url', $menu->url ?? '') }}" required placeholder="/products">
    @error('url')
        <div class="invalid-feedback">{{ $message }}</div>
    @enderror
</div>

<div class="mb-3">
    <label for="position" class="form-label">Position</label>
    <select id="position" name="position" class="form-select @error('position') is-invalid @enderror" required>
        <option value="header" {{ old('position', $menu->position ?? '') === 'header' ? 'selected' : '' }}>Header</option>
        <option value="footer" {{ old('position', $menu->position ?? '') === 'footer' ? 'selected' : '' }}>Footer</option>
    </select>
    @error('position')
        <div class="invalid-feedback">{{ $message }}</div>
    @enderror
</div>

<div class="mb-3">
    <label for="parent_id" class="form-label">Parent Menu</label>
    <select id="parent_id" name="parent_id" class="form-select @error('parent_id') is-invalid @enderror">
        <option value="">None</option>
        @foreach ($parents as $parent)
            <option value="{{ $parent->id }}" {{ old('parent_id', $menu->parent_id ?? '') == $parent->id ? 'selected' : '' }}>
                {{ $parent->label }}
            </option>
        @endforeach
    </select>
    @error('parent_id')
        <div class="invalid-feedback">{{ $message }}</div>
    @enderror
</div>

<div class="row mb-3">
    <div class="col-md-6">
        <label for="sort_order" class="form-label">Sort Order</label>
        <input type="number" id="sort_order" name="sort_order" class="form-control @error('sort_order') is-invalid @enderror"
               value="{{ old('sort_order', $menu->sort_order ?? 0) }}">
        @error('sort_order')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>
    <div class="col-md-6 d-flex align-items-center">
        <div class="form-check form-switch mt-4">
            <input type="checkbox" id="status" name="status" value="1" class="form-check-input"
                   {{ old('status', $menu->status ?? true) ? 'checked' : '' }}>
            <label class="form-check-label" for="status">Active</label>
        </div>
    </div>
</div>

<div class="d-flex gap-2">
    <button type="submit" class="btn btn-primary">{{ isset($menu) && $menu->id ? 'Update' : 'Create' }} Menu</button>
    <a href="{{ route('admin.menus.index') }}" class="btn btn-outline-secondary">Cancel</a>
</div>
