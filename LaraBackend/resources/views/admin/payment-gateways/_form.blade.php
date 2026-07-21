@php
    $gateway = $gateway ?? null;
    $val = fn ($field, $default = null) => old($field, $gateway ? $gateway->{$field} : $default);
    $config = $gateway && is_array($gateway->config) ? json_encode($gateway->config, JSON_PRETTY_PRINT) : old('config', '{}');
@endphp

<div class="row g-3">
    <div class="col-md-6">
        <label class="form-label">Name <span class="text-danger">*</span></label>
        <input type="text" name="name" value="{{ $val('name') }}" class="form-control @error('name') is-invalid @enderror" required>
        @error('name')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-md-6">
        <label class="form-label">Code <span class="text-danger">*</span></label>
        <input type="text" name="code" value="{{ $val('code') }}" class="form-control @error('code') is-invalid @enderror" required>
        @error('code')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-md-6">
        <label class="form-label">Sort Order</label>
        <input type="number" name="sort_order" value="{{ $val('sort_order', 0) }}" class="form-control @error('sort_order') is-invalid @enderror">
        @error('sort_order')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-md-6 d-flex align-items-end">
        <div class="form-check form-switch">
            <input type="hidden" name="status" value="0">
            <input type="checkbox" name="status" value="1" class="form-check-input" id="statusSwitch" {{ $val('status', true) ? 'checked' : '' }}>
            <label class="form-check-label" for="statusSwitch">Active</label>
        </div>
    </div>

    <div class="col-12">
        <label class="form-label">Config (JSON)</label>
        <textarea name="config" rows="6" class="form-control @error('config') is-invalid @enderror" style="font-family: monospace;">{{ $config }}</textarea>
        <div class="form-text">Enter a valid JSON object with gateway credentials/settings.</div>
        @error('config')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>
</div>

<div class="mt-4">
    <button type="submit" class="btn btn-primary"><i class="fas fa-save me-1"></i> {{ $submitLabel ?? 'Save' }}</button>
    <a href="{{ route('admin.payment-gateways.index') }}" class="btn btn-outline-secondary">Cancel</a>
</div>
