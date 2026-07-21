<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Support\ActivityLogger;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    private const IMAGE_DISK = 'public';

    private const IMAGE_DIR = 'banners';

    public function index(Request $request): View
    {
        $query = Banner::query();

        if ($request->filled('position')) {
            $query->where('position', $request->query('position'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->boolean('status'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where('title', 'like', "%{$search}%");
        }

        $banners = $query->orderBy('sort_order', 'asc')->latest()->paginate(15)->appends($request->query());

        return view('admin.banners.index', [
            'banners' => $banners,
            'search' => $request->query('search'),
            'position' => $request->query('position'),
            'status' => $request->query('status'),
        ]);
    }

    public function create(): View
    {
        return view('admin.banners.create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'string', 'max:500'],
            'image_file' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
            'link' => ['nullable', 'string', 'max:500'],
            'button_text' => ['nullable', 'string', 'max:100'],
            'position' => ['required', 'string', 'max:50'],
            'sort_order' => ['nullable', 'integer'],
            'status' => ['boolean'],
        ]);

        if ($request->hasFile('image_file')) {
            $validated['image'] = $request->file('image_file')->store(self::IMAGE_DIR, self::IMAGE_DISK);
        }

        $banner = Banner::create([
            ...$validated,
            'status' => $request->boolean('status', true),
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        ActivityLogger::log('created', 'banner', $banner->id, "Created banner: {$banner->title}");

        return redirect()->route('admin.banners.index')->with('success', 'Banner created successfully.');
    }

    public function edit(Banner $banner): View
    {
        return view('admin.banners.edit', compact('banner'));
    }

    public function update(Request $request, Banner $banner): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'string', 'max:500'],
            'image_file' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
            'link' => ['nullable', 'string', 'max:500'],
            'button_text' => ['nullable', 'string', 'max:100'],
            'position' => ['required', 'string', 'max:50'],
            'sort_order' => ['nullable', 'integer'],
            'status' => ['boolean'],
        ]);

        if ($request->hasFile('image_file')) {
            $this->deleteStoredImage($banner->getRawOriginal('image'));
            $validated['image'] = $request->file('image_file')->store(self::IMAGE_DIR, self::IMAGE_DISK);
        }

        $banner->update([
            ...$validated,
            'status' => $request->boolean('status', true),
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        ActivityLogger::log('updated', 'banner', $banner->id, "Updated banner: {$banner->title}");

        return redirect()->route('admin.banners.index')->with('success', 'Banner updated successfully.');
    }

    public function destroy(Banner $banner): RedirectResponse
    {
        $title = $banner->title;
        $id = $banner->id;
        $this->deleteStoredImage($banner->getRawOriginal('image'));
        $banner->delete();

        ActivityLogger::log('deleted', 'banner', $id, "Deleted banner: {$title}");

        return redirect()->route('admin.banners.index')->with('success', 'Banner deleted successfully.');
    }

    public function toggleStatus(Banner $banner): RedirectResponse
    {
        $banner->update(['status' => ! $banner->status]);

        ActivityLogger::log(
            'status_changed',
            'banner',
            $banner->id,
            "Banner #{$banner->id} status changed to ".($banner->status ? 'enabled' : 'disabled')
        );

        return redirect()->back()->with('success', 'Banner status updated.');
    }

    /**
     * Delete a previously uploaded banner image from the public disk.
     * External URLs (http/https) and root-relative paths are left untouched.
     */
    private function deleteStoredImage(?string $image): void
    {
        if (empty($image) || str_starts_with($image, 'http') || str_starts_with($image, '/')) {
            return;
        }

        Storage::disk(self::IMAGE_DISK)->delete($image);
    }
}
