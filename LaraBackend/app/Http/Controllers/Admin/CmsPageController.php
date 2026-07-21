<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Support\ActivityLogger;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CmsPageController extends Controller
{
    public function index(Request $request): View
    {
        $query = Page::query();

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $pages = $query->orderBy('sort_order', 'asc')->latest()->paginate(15)->appends($request->query());

        return view('admin.pages.index', [
            'pages' => $pages,
            'search' => $request->query('search'),
            'status' => $request->query('status'),
        ]);
    }

    public function create(): View
    {
        return view('admin.pages.create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'slug' => ['required', 'string', 'max:255', 'unique:pages,slug'],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'status' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $page = Page::create([
            ...$validated,
            'status' => $request->boolean('status', true),
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        ActivityLogger::log('created', 'cms_page', $page->id, "Created CMS page: {$page->title}");

        return redirect()->route('admin.pages.index')->with('success', 'Page created successfully.');
    }

    public function edit(Page $page): View
    {
        return view('admin.pages.edit', compact('page'));
    }

    public function update(Request $request, Page $page): RedirectResponse
    {
        $validated = $request->validate([
            'slug' => ['required', 'string', 'max:255', "unique:pages,slug,{$page->id}"],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'status' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $page->update([
            ...$validated,
            'status' => $request->boolean('status', true),
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        ActivityLogger::log('updated', 'cms_page', $page->id, "Updated CMS page: {$page->title}");

        return redirect()->route('admin.pages.index')->with('success', 'Page updated successfully.');
    }

    public function destroy(Page $page): RedirectResponse
    {
        $title = $page->title;
        $id = $page->id;
        $page->delete();

        ActivityLogger::log('deleted', 'cms_page', $id, "Deleted CMS page: {$title}");

        return redirect()->route('admin.pages.index')->with('success', 'Page deleted successfully.');
    }

    public function toggleStatus(Page $page): RedirectResponse
    {
        $page->update(['status' => ! $page->status]);

        ActivityLogger::log(
            'status_changed',
            'cms_page',
            $page->id,
            "CMS page #{$page->id} status changed to ".($page->status ? 'enabled' : 'disabled')
        );

        return redirect()->back()->with('success', 'Page status updated.');
    }
}
