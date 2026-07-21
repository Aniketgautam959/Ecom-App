@php
    $brand = $brand ?? null;
    $val = fn ($field, $default = null) => old($field, $brand ? $brand->{$field} : $default);
@endphp

<div class="row g-3">
    <div class="col-md-8">
        <label class="form-label">Name <span class="text-danger">*</span></label>
        <input type="text" name="name" value="{{ $val('name') }}"
               class="form-control @error('name') is-invalid @enderror" required>
        <div class="form-text">Slug is generated automatically from the name.</div>
        @error('name')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-md-4">
        <label class="form-label">Logo URL</label>
        <input type="text" name="logo" value="{{ $val('logo') }}"
               class="form-control @error('logo') is-invalid @enderror">
        @error('logo')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-12">
        <label class="form-label">Description</label>
        <textarea name="description" rows="4"
                  class="form-control @error('description') is-invalid @enderror">{{ $val('description') }}</textarea>
        @error('description')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-md-4">
        <label class="form-label">Sort Order</label>
        <input type="number" name="sort_order" min="0" value="{{ $val('sort_order', 0) }}"
               class="form-control @error('sort_order') is-invalid @enderror">
        @error('sort_order')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-md-4 d-flex align-items-end">
        <div class="form-check form-switch">
            <input type="hidden" name="status" value="0">
            <input type="checkbox" name="status" value="1" class="form-check-input" id="statusSwitch"
                   {{ $val('status', true) ? 'checked' : '' }}>
            <label class="form-check-label" for="statusSwitch">Enabled</label>
        </div>
    </div>
</div>

<div class="mt-4">
    <button type="submit" class="btn btn-primary">
        <i class="fas fa-save me-1"></i> {{ $submitLabel ?? 'Save' }}
    </button>
    <a href="{{ route('admin.brands.index') }}" class="btn btn-outline-secondary">Cancel</a>
</div>
