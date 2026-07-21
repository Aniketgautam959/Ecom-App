@php
    $coupon = $coupon ?? null;
    $val = fn ($field, $default = null) => old($field, $coupon ? $coupon->{$field} : $default);
@endphp

<div class="row g-3">
    <div class="col-md-4">
        <label class="form-label">Coupon Code <span class="text-danger">*</span></label>
        <input type="text" name="code" value="{{ $val('code') }}"
               class="form-control @error('code') is-invalid @enderror" required>
        @error('code')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-md-4">
        <label class="form-label">Discount Type <span class="text-danger">*</span></label>
        <select name="type" class="form-select @error('type') is-invalid @enderror" required>
            <option value="percentage" {{ $val('type', 'percentage') === 'percentage' ? 'selected' : '' }}>Percentage (%)</option>
            <option value="fixed" {{ $val('type') === 'fixed' ? 'selected' : '' }}>Fixed Amount</option>
        </select>
        @error('type')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-md-4">
        <label class="form-label">Value <span class="text-danger">*</span></label>
        <input type="number" step="0.01" min="0" name="value" value="{{ $val('value') }}"
               class="form-control @error('value') is-invalid @enderror" required>
        @error('value')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-md-6">
        <label class="form-label">Description</label>
        <input type="text" name="description" value="{{ $val('description') }}"
               class="form-control @error('description') is-invalid @enderror">
        @error('description')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-md-3">
        <label class="form-label">Min Order Amount</label>
        <input type="number" step="0.01" min="0" name="min_order_amount" value="{{ $val('min_order_amount', 0) }}"
               class="form-control @error('min_order_amount') is-invalid @enderror">
        @error('min_order_amount')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-md-3">
        <label class="form-label">Max Discount</label>
        <input type="number" step="0.01" min="0" name="max_discount" value="{{ $val('max_discount') }}"
               class="form-control @error('max_discount') is-invalid @enderror">
        <div class="form-text">Only applies to percentage coupons.</div>
        @error('max_discount')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-md-4">
        <label class="form-label">Starts At</label>
        <input type="datetime-local" name="starts_at" value="{{ $val('starts_at') }}"
               class="form-control @error('starts_at') is-invalid @enderror">
        @error('starts_at')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-md-4">
        <label class="form-label">Expires At</label>
        <input type="datetime-local" name="expires_at" value="{{ $val('expires_at') }}"
               class="form-control @error('expires_at') is-invalid @enderror">
        @error('expires_at')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-md-2">
        <label class="form-label">Usage Limit</label>
        <input type="number" min="1" name="usage_limit" value="{{ $val('usage_limit') }}"
               class="form-control @error('usage_limit') is-invalid @enderror">
        @error('usage_limit')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-md-2">
        <label class="form-label">Per User Limit</label>
        <input type="number" min="1" name="per_user_limit" value="{{ $val('per_user_limit') }}"
               class="form-control @error('per_user_limit') is-invalid @enderror">
        @error('per_user_limit')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-md-3 d-flex align-items-end">
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
    <a href="{{ route('admin.coupons.index') }}" class="btn btn-outline-secondary">Cancel</a>
</div>
