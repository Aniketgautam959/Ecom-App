@php
    $notification = $notification ?? null;
    $val = fn ($field, $default = null) => old($field, $notification ? $notification->{$field} : $default);
@endphp

<div class="row g-3">
    <div class="col-md-6">
        <label class="form-label">Title <span class="text-danger">*</span></label>
        <input type="text" name="title" value="{{ $val('title') }}"
               class="form-control @error('title') is-invalid @enderror" required>
        @error('title')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-md-3">
        <label class="form-label">Type <span class="text-danger">*</span></label>
        <select name="type" class="form-select @error('type') is-invalid @enderror" required>
            @foreach ($types as $type)
                <option value="{{ $type }}" {{ $val('type') === $type ? 'selected' : '' }}>{{ ucfirst($type) }}</option>
            @endforeach
        </select>
        @error('type')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-md-3">
        <label class="form-label">Link URL</label>
        <input type="text" name="link" value="{{ $val('link') }}"
               class="form-control @error('link') is-invalid @enderror">
        @error('link')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    <div class="col-12">
        <label class="form-label">Message</label>
        <textarea name="message" rows="4"
                  class="form-control @error('message') is-invalid @enderror">{{ $val('message') }}</textarea>
        @error('message')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    @if (! $notification)
        <div class="col-md-6">
            <label class="form-label">Recipient <span class="text-danger">*</span></label>
            <select name="recipient" id="recipientSelect"
                    class="form-select @error('recipient') is-invalid @enderror" required>
                <option value="all" {{ old('recipient') === 'all' ? 'selected' : '' }}>All Users</option>
                <option value="single" {{ old('recipient') === 'single' ? 'selected' : '' }}>Specific User</option>
            </select>
            @error('recipient')<div class="invalid-feedback">{{ $message }}</div>@enderror
        </div>

        <div class="col-md-6" id="userSelectContainer" style="{{ old('recipient') === 'single' ? '' : 'display: none;' }}">
            <label class="form-label">User <span class="text-danger">*</span></label>
            <select name="user_id" class="form-select @error('user_id') is-invalid @enderror">
                <option value="">Select user</option>
                @foreach ($users as $user)
                    <option value="{{ $user->id }}" {{ old('user_id') == $user->id ? 'selected' : '' }}>
                        {{ $user->first_name }} {{ $user->last_name }} ({{ $user->email_id }})
                    </option>
                @endforeach
            </select>
            @error('user_id')<div class="invalid-feedback">{{ $message }}</div>@enderror
        </div>
    @else
        <div class="col-md-6">
            <label class="form-label">User</label>
            @php
                $nUser = $notification->user;
                $nUserName = $nUser ? trim($nUser->first_name.' '.$nUser->last_name) : 'Unknown';
            @endphp
            <input type="text" class="form-control" value="{{ $nUserName }} ({{ $nUser?->email_id }})" disabled>
        </div>
    @endif

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
    <a href="{{ route('admin.notifications.index') }}" class="btn btn-outline-secondary">Cancel</a>
</div>

@if (! $notification)
<script>
    document.getElementById('recipientSelect')?.addEventListener('change', function () {
        document.getElementById('userSelectContainer').style.display = this.value === 'single' ? 'block' : 'none';
    });
</script>
@endif
