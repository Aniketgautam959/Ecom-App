@php
    $role = $role ?? null;
    $val = fn ($field, $default = null) => old($field, $role ? $role->{$field} : $default);
    $selectedPermissions = $role && is_array($role->permissions) ? $role->permissions : old('permissions', []);
@endphp

<div class="row g-3">
    <div class="col-md-6">
        <label class="form-label">Name <span class="text-danger">*</span></label>
        <input type="text" name="name" value="{{ $val('name') }}" class="form-control @error('name') is-invalid @enderror" required>
        @error('name')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-md-6">
        <label class="form-label">Slug <span class="text-danger">*</span></label>
        <input type="text" name="slug" value="{{ $val('slug') }}" class="form-control @error('slug') is-invalid @enderror" required>
        @error('slug')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-12">
        <label class="form-label">Description</label>
        <textarea name="description" rows="3" class="form-control @error('description') is-invalid @enderror">{{ $val('description') }}</textarea>
        @error('description')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-md-3 d-flex align-items-end">
        <div class="form-check form-switch">
            <input type="hidden" name="status" value="0">
            <input type="checkbox" name="status" value="1" class="form-check-input" id="statusSwitch" {{ $val('status', true) ? 'checked' : '' }}>
            <label class="form-check-label" for="statusSwitch">Active</label>
        </div>
    </div>

    <div class="col-12">
        <label class="form-label">Permissions</label>
        <div class="row g-2">
            @foreach ($permissions as $permission)
                <div class="col-md-3">
                    <div class="form-check">
                        <input type="checkbox" name="permissions[]" value="{{ $permission }}" class="form-check-input" id="perm-{{ $permission }}"
                            {{ in_array($permission, $selectedPermissions) ? 'checked' : '' }}>
                        <label class="form-check-label text-capitalize" for="perm-{{ $permission }}">
                            {{ str_replace('_', ' ', $permission) }}
                        </label>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</div>

<div class="mt-4">
    <button type="submit" class="btn btn-primary"><i class="fas fa-save me-1"></i> {{ $submitLabel ?? 'Save' }}</button>
    <a href="{{ route('admin.roles.index') }}" class="btn btn-outline-secondary">Cancel</a>
</div>
