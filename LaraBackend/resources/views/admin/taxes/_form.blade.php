@php
    $tax = $tax ?? null;
    $val = fn ($field, $default = null) => old($field, $tax ? $tax->{$field} : $default);
@endphp

<div class="row g-3">
    <div class="col-md-6">
        <label class="form-label">Name <span class="text-danger">*</span></label>
        <input type="text" name="name" value="{{ $val('name') }}" class="form-control @error('name') is-invalid @enderror" required>
        @error('name')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-md-6">
        <label class="form-label">Rate (%) <span class="text-danger">*</span></label>
        <input type="number" step="0.01" name="rate" value="{{ $val('rate', 0) }}" class="form-control @error('rate') is-invalid @enderror" required>
        @error('rate')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-md-6">
        <label class="form-label">Country</label>
        <input type="text" name="country" value="{{ $val('country') }}" class="form-control @error('country') is-invalid @enderror">
        @error('country')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-md-6">
        <label class="form-label">State</label>
        <input type="text" name="state" value="{{ $val('state') }}" class="form-control @error('state') is-invalid @enderror">
        @error('state')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-md-4 d-flex align-items-end">
        <div class="form-check form-switch">
            <input type="hidden" name="is_default" value="0">
            <input type="checkbox" name="is_default" value="1" class="form-check-input" id="isDefaultSwitch" {{ $val('is_default', false) ? 'checked' : '' }}>
            <label class="form-check-label" for="isDefaultSwitch">Default</label>
        </div>
    </div>

    <div class="col-md-4 d-flex align-items-end">
        <div class="form-check form-switch">
            <input type="hidden" name="status" value="0">
            <input type="checkbox" name="status" value="1" class="form-check-input" id="statusSwitch" {{ $val('status', true) ? 'checked' : '' }}>
            <label class="form-check-label" for="statusSwitch">Active</label>
        </div>
    </div>
</div>

<div class="mt-4">
    <button type="submit" class="btn btn-primary"><i class="fas fa-save me-1"></i> {{ $submitLabel ?? 'Save' }}</button>
    <a href="{{ route('admin.taxes.index') }}" class="btn btn-outline-secondary">Cancel</a>
</div>
