@if ($errors->any())
    <div class="alert alert-danger">
        <ul class="mb-0 small">
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<div class="mb-3">
    <label for="name" class="form-label fw-medium">Product Name <span class="text-danger">*</span></label>
    <input type="text" id="name" name="name" class="form-control @error('name') is-invalid @enderror"
        value="{{ old('name', $product->name ?? '') }}" required>
    @error('name') <div class="invalid-feedback">{{ $message }}</div> @enderror
</div>

<div class="row g-3 mb-3">
    <div class="col-md-6">
        <label for="category_id" class="form-label fw-medium">Category</label>
        <select id="category_id" name="category_id" class="form-select @error('category_id') is-invalid @enderror">
            <option value="">— Select Category —</option>
            @foreach ($categories as $cat)
                <option value="{{ $cat->id }}"
                    {{ old('category_id', $product->category_id ?? '') == $cat->id ? 'selected' : '' }}>
                    {{ $cat->name }}
                </option>
            @endforeach
        </select>
        @error('category_id') <div class="invalid-feedback">{{ $message }}</div> @enderror
    </div>
    <div class="col-md-6">
        <label for="brand_id" class="form-label fw-medium">Brand</label>
        <select id="brand_id" name="brand_id" class="form-select @error('brand_id') is-invalid @enderror">
            <option value="">— Select Brand —</option>
            @foreach ($brands as $brand)
                <option value="{{ $brand->id }}"
                    {{ old('brand_id', $product->brand_id ?? '') == $brand->id ? 'selected' : '' }}>
                    {{ $brand->name }}
                </option>
            @endforeach
        </select>
        @error('brand_id') <div class="invalid-feedback">{{ $message }}</div> @enderror
    </div>
</div>

<div class="mb-3">
    <label for="price" class="form-label fw-medium">Price <span class="text-danger">*</span></label>
    <div class="input-group">
        <span class="input-group-text">@currency</span>
        <input type="number" id="price" name="price" step="0.01" min="0"
            class="form-control @error('price') is-invalid @enderror"
            value="{{ old('price', $product->price ?? '') }}" required>
    </div>
    @error('price') <div class="invalid-feedback d-block">{{ $message }}</div> @enderror
</div>

<div class="mb-3">
    <label for="image" class="form-label fw-medium">Main Image URL <span class="text-muted small">(optional)</span></label>
    <input type="text" id="image" name="image" class="form-control @error('image') is-invalid @enderror"
        placeholder="https://example.com/image.jpg"
        value="{{ old('image', $product->image ?? '') }}">
    <div class="form-text">Leave empty to use the first gallery image as the main image.</div>
    @error('image') <div class="invalid-feedback">{{ $message }}</div> @enderror
    @if (!empty($product->image ?? ''))
        <div class="mt-2">
            <img src="{{ $product->image }}" alt="Product image" class="rounded" style="height:60px;object-fit:cover;">
        </div>
    @endif
</div>

@php
    $existingImages = isset($product) ? $product->media->where('type', 'image')->sortBy('sort_order') : collect();
    $existingVideo = isset($product) ? $product->media->firstWhere('type', 'video') : null;
    $videoSourceOld = old('video_source', $existingVideo ? ($existingVideo->is_external ? 'url' : 'upload') : 'none');
@endphp

{{-- Image Gallery --}}
<div class="mb-4">
    <label class="form-label fw-medium d-block">Image Gallery</label>
    <div class="form-text mb-2">
        Upload multiple images. Drag to reorder, click &times; to remove an existing image.
        Newly added images are shown with a <span class="badge bg-primary" style="font-size:.65rem;">New</span> badge and will be appended on save.
    </div>

    {{-- Existing images grid --}}
    <div id="gallery-grid" class="d-flex flex-wrap gap-2 mb-2" style="min-height:40px;">
        @foreach ($existingImages as $media)
            <div class="gallery-item position-relative border rounded" data-id="{{ $media->id }}" style="cursor:grab;">
                <img src="{{ url($media->url) }}" alt="Gallery image"
                    style="width:90px;height:90px;object-fit:cover;border-radius:.375rem;">
                <button type="button"
                    class="gallery-remove position-absolute d-flex align-items-center justify-content-center
                           bg-danger text-white border-0 rounded-circle"
                    title="Remove image"
                    style="width:22px;height:22px;top:-8px;right:-8px;font-size:14px;line-height:1;cursor:pointer;">
                    &times;
                </button>
                <input type="hidden" name="media_order[]" value="{{ $media->id }}">
            </div>
        @endforeach
    </div>

    {{-- New-image previews (client-side only, not yet saved) --}}
    <div id="new-images-grid" class="d-flex flex-wrap gap-2 mb-2"></div>
    <div id="new-images-count" class="form-text text-primary d-none mb-2"></div>

    <div id="removed-media-inputs"></div>

    <label for="images" class="btn btn-outline-secondary btn-sm mb-1">
        <i class="fas fa-plus me-1"></i> Add Images
    </label>
    <input type="file" id="images" name="images[]" multiple accept="image/*"
        class="d-none @error('images.*') is-invalid @enderror">
    @error('images.*') <div class="invalid-feedback d-block">{{ $message }}</div> @enderror
    <div class="form-text">Existing images are preserved unless you click their &times; button.</div>
</div>

{{-- Product Video --}}
<div class="mb-4">
    <label class="form-label fw-medium d-block">Product Video <span class="text-muted small">(optional)</span></label>

    <div class="btn-group mb-2" role="group">
        <input type="radio" class="btn-check" name="video_source" id="video_none" value="none"
            {{ $videoSourceOld === 'none' ? 'checked' : '' }}>
        <label class="btn btn-outline-secondary btn-sm" for="video_none">None</label>

        <input type="radio" class="btn-check" name="video_source" id="video_upload" value="upload"
            {{ $videoSourceOld === 'upload' ? 'checked' : '' }}>
        <label class="btn btn-outline-secondary btn-sm" for="video_upload">Upload File</label>

        <input type="radio" class="btn-check" name="video_source" id="video_url_radio" value="url"
            {{ $videoSourceOld === 'url' ? 'checked' : '' }}>
        <label class="btn btn-outline-secondary btn-sm" for="video_url_radio">Video URL</label>
    </div>

    @if ($existingVideo)
        <div class="mb-2">
            <span class="badge bg-light text-dark border">Current video:
                @if ($existingVideo->is_external)
                    <a href="{{ $existingVideo->url }}" target="_blank">{{ Str::limit($existingVideo->path, 50) }}</a>
                @else
                    uploaded file
                @endif
            </span>
        </div>
    @endif

    <div id="video-upload-field" class="mb-2 {{ $videoSourceOld === 'upload' ? '' : 'd-none' }}">
        <input type="file" name="video_file" accept="video/mp4,video/webm,video/ogg"
            class="form-control @error('video_file') is-invalid @enderror">
        @error('video_file') <div class="invalid-feedback d-block">{{ $message }}</div> @enderror
    </div>

    <div id="video-url-field" class="mb-2 {{ $videoSourceOld === 'url' ? '' : 'd-none' }}">
        <input type="url" name="video_url" placeholder="https://example.com/video.mp4"
            class="form-control @error('video_url') is-invalid @enderror"
            value="{{ old('video_url', $existingVideo && $existingVideo->is_external ? $existingVideo->path : '') }}">
        @error('video_url') <div class="invalid-feedback d-block">{{ $message }}</div> @enderror
    </div>
</div>

{{-- Product Variants (Sizes / Colors / Stock) --}}
@php
    $existingVariants = old('variants', isset($product) ? $product->variants->map(fn($v) => [
        'size' => $v->size,
        'color_name' => $v->color_name,
        'color_hex' => $v->color_hex,
        'price_override' => $v->price_override,
        'stock' => $v->stock,
    ])->toArray() : []);
@endphp

<div class="mb-4">
    <label class="form-label fw-medium d-block">Product Variants <span class="text-muted small">(optional)</span></label>
    <div class="form-text mb-2">Add size/color combinations. Each row is a variant with optional price override and stock.</div>

    <div id="variants-container">
        @foreach ($existingVariants as $i => $variant)
            <div class="variant-row row g-2 mb-2 align-items-end">
                <div class="col">
                    <input type="text" name="variants[{{ $i }}][size]" class="form-control form-control-sm"
                        placeholder="Size (e.g. M)" value="{{ $variant['size'] ?? '' }}">
                </div>
                <div class="col">
                    <input type="text" name="variants[{{ $i }}][color_name]" class="form-control form-control-sm"
                        placeholder="Color name" value="{{ $variant['color_name'] ?? '' }}">
                </div>
                <div class="col-auto" style="width:60px;">
                    <input type="color" name="variants[{{ $i }}][color_hex]" class="form-control form-control-sm form-control-color"
                        value="{{ $variant['color_hex'] ?? '#000000' }}" title="Color">
                </div>
                <div class="col">
                    <input type="number" name="variants[{{ $i }}][price_override]" class="form-control form-control-sm"
                        placeholder="Price override" step="0.01" min="0" value="{{ $variant['price_override'] ?? '' }}">
                </div>
                <div class="col">
                    <input type="number" name="variants[{{ $i }}][stock]" class="form-control form-control-sm"
                        placeholder="Stock" min="0" value="{{ $variant['stock'] ?? 0 }}">
                </div>
                <div class="col-auto">
                    <button type="button" class="btn btn-sm btn-outline-danger variant-remove">&times;</button>
                </div>
            </div>
        @endforeach
    </div>

    <button type="button" id="add-variant-btn" class="btn btn-sm btn-outline-secondary mt-1">
        <i class="fas fa-plus me-1"></i> Add Variant
    </button>
</div>

<div class="mb-4">
    <div class="form-check form-switch">
        <input type="hidden" name="status" value="0">
        <input class="form-check-input" type="checkbox" id="status" name="status" value="1"
            {{ old('status', $product->status ?? true) ? 'checked' : '' }}>
        <label class="form-check-label" for="status">Active</label>
    </div>
</div>

@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function () {
    // --- Video source toggle ---
    const uploadField = document.getElementById('video-upload-field');
    const urlField = document.getElementById('video-url-field');

    function toggleVideoFields(value) {
        uploadField.classList.toggle('d-none', value !== 'upload');
        urlField.classList.toggle('d-none', value !== 'url');
    }

    document.querySelectorAll('input[name="video_source"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
            toggleVideoFields(this.value);
        });
    });

    // --- Gallery reorder + remove (existing images) ---
    const grid = document.getElementById('gallery-grid');
    const newGrid = document.getElementById('new-images-grid');
    const newCountLabel = document.getElementById('new-images-count');
    const removedContainer = document.getElementById('removed-media-inputs');
    const fileInput = document.getElementById('images');

    // Accumulated DataTransfer so multiple "Add Images" clicks are additive.
    let accumulatedFiles = new DataTransfer();

    if (grid && window.Sortable) {
        Sortable.create(grid, { animation: 150, ghostClass: 'opacity-50' });
    }

    // Delete existing saved image
    if (grid) {
        grid.addEventListener('click', function (e) {
            const btn = e.target.closest('.gallery-remove');
            if (!btn) return;

            const item = btn.closest('.gallery-item');
            const id = item.getAttribute('data-id');

            if (id) {
                const removed = document.createElement('input');
                removed.type = 'hidden';
                removed.name = 'remove_media[]';
                removed.value = id;
                removedContainer.appendChild(removed);
            }

            item.remove();
        });
    }

    // Remove a newly picked (not-yet-saved) image
    if (newGrid) {
        newGrid.addEventListener('click', function (e) {
            const btn = e.target.closest('.new-img-remove');
            if (!btn) return;

            const item = btn.closest('.new-gallery-item');
            const idx = parseInt(item.getAttribute('data-new-idx'), 10);

            // Rebuild accumulated files without this index
            const updated = new DataTransfer();
            Array.from(accumulatedFiles.files).forEach(function (f, i) {
                if (i !== idx) updated.items.add(f);
            });
            accumulatedFiles = updated;
            fileInput.files = accumulatedFiles.files;

            item.remove();
            rebuildNewPreviews();
        });
    }

    // When new files are chosen, accumulate and render previews
    if (fileInput) {
        fileInput.addEventListener('change', function () {
            Array.from(fileInput.files).forEach(function (file) {
                accumulatedFiles.items.add(file);
            });
            fileInput.files = accumulatedFiles.files;
            rebuildNewPreviews();
        });
    }

    function rebuildNewPreviews() {
        if (!newGrid) return;
        newGrid.innerHTML = '';

        const files = accumulatedFiles.files;

        Array.from(files).forEach(function (file, idx) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const wrapper = document.createElement('div');
                wrapper.className = 'new-gallery-item position-relative border border-primary rounded';
                wrapper.setAttribute('data-new-idx', idx);
                wrapper.style.cssText = 'display:inline-block;';

                wrapper.innerHTML = `
                    <img src="${e.target.result}" alt="New image"
                        style="width:90px;height:90px;object-fit:cover;border-radius:.375rem;display:block;">
                    <span class="badge bg-primary position-absolute"
                        style="bottom:4px;left:4px;font-size:.6rem;">New</span>
                    <button type="button"
                        class="new-img-remove position-absolute d-flex align-items-center justify-content-center
                               bg-danger text-white border-0 rounded-circle"
                        title="Remove"
                        style="width:22px;height:22px;top:-8px;right:-8px;font-size:14px;line-height:1;cursor:pointer;">
                        &times;
                    </button>
                `;
                newGrid.appendChild(wrapper);
            };
            reader.readAsDataURL(file);
        });

        if (newCountLabel) {
            if (files.length > 0) {
                newCountLabel.textContent = files.length + ' new image' + (files.length > 1 ? 's' : '') + ' queued — will be appended on save.';
                newCountLabel.classList.remove('d-none');
            } else {
                newCountLabel.classList.add('d-none');
            }
        }
    }

    // --- Variant add / remove ---
    const variantsContainer = document.getElementById('variants-container');
    const addVariantBtn = document.getElementById('add-variant-btn');
    let variantIndex = variantsContainer ? variantsContainer.querySelectorAll('.variant-row').length : 0;

    if (addVariantBtn) {
        addVariantBtn.addEventListener('click', function () {
            const row = document.createElement('div');
            row.className = 'variant-row row g-2 mb-2 align-items-end';
            row.innerHTML = `
                <div class="col">
                    <input type="text" name="variants[${variantIndex}][size]" class="form-control form-control-sm" placeholder="Size (e.g. M)">
                </div>
                <div class="col">
                    <input type="text" name="variants[${variantIndex}][color_name]" class="form-control form-control-sm" placeholder="Color name">
                </div>
                <div class="col-auto" style="width:60px;">
                    <input type="color" name="variants[${variantIndex}][color_hex]" class="form-control form-control-sm form-control-color" value="#000000" title="Color">
                </div>
                <div class="col">
                    <input type="number" name="variants[${variantIndex}][price_override]" class="form-control form-control-sm" placeholder="Price override" step="0.01" min="0">
                </div>
                <div class="col">
                    <input type="number" name="variants[${variantIndex}][stock]" class="form-control form-control-sm" placeholder="Stock" min="0" value="0">
                </div>
                <div class="col-auto">
                    <button type="button" class="btn btn-sm btn-outline-danger variant-remove">&times;</button>
                </div>
            `;
            variantsContainer.appendChild(row);
            variantIndex++;
        });
    }

    if (variantsContainer) {
        variantsContainer.addEventListener('click', function (e) {
            const btn = e.target.closest('.variant-remove');
            if (btn) btn.closest('.variant-row').remove();
        });
    }
});
</script>
@endpush
