<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Support\ActivityLogger;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index(Request $request): View
    {
        $query = Menu::query();

        if ($request->filled('position')) {
            $query->where('position', $request->query('position'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $menus = $query->with('children')
            ->whereNull('parent_id')
            ->orderBy('sort_order', 'asc')
            ->latest()
            ->paginate(15)
            ->appends($request->query());

        return view('admin.menus.index', [
            'menus' => $menus,
            'position' => $request->query('position'),
            'status' => $request->query('status'),
        ]);
    }

    public function create(): View
    {
        $parents = Menu::active()->whereNull('parent_id')->orderBy('label')->get();

        return view('admin.menus.create', compact('parents'));
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'label' => ['required', 'string', 'max:255'],
            'url' => ['required', 'string', 'max:500'],
            'position' => ['required', 'string', 'max:50'],
            'parent_id' => ['nullable', 'integer', 'exists:menus,id'],
            'sort_order' => ['nullable', 'integer'],
            'status' => ['boolean'],
        ]);

        $menu = Menu::create([
            ...$validated,
            'status' => $request->boolean('status', true),
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        ActivityLogger::log('created', 'menu', $menu->id, "Created menu item: {$menu->label}");

        return redirect()->route('admin.menus.index')->with('success', 'Menu item created successfully.');
    }

    public function edit(Menu $menu): View
    {
        $parents = Menu::active()->whereNull('parent_id')->where('id', '!=', $menu->id)->orderBy('label')->get();

        return view('admin.menus.edit', compact('menu', 'parents'));
    }

    public function update(Request $request, Menu $menu): RedirectResponse
    {
        $validated = $request->validate([
            'label' => ['required', 'string', 'max:255'],
            'url' => ['required', 'string', 'max:500'],
            'position' => ['required', 'string', 'max:50'],
            'parent_id' => ['nullable', 'integer', 'exists:menus,id'],
            'sort_order' => ['nullable', 'integer'],
            'status' => ['boolean'],
        ]);

        $menu->update([
            ...$validated,
            'status' => $request->boolean('status', true),
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        ActivityLogger::log('updated', 'menu', $menu->id, "Updated menu item: {$menu->label}");

        return redirect()->route('admin.menus.index')->with('success', 'Menu item updated successfully.');
    }

    public function destroy(Menu $menu): RedirectResponse
    {
        $label = $menu->label;
        $id = $menu->id;
        $menu->children()->delete();
        $menu->delete();

        ActivityLogger::log('deleted', 'menu', $id, "Deleted menu item: {$label}");

        return redirect()->route('admin.menus.index')->with('success', 'Menu item deleted successfully.');
    }

    public function toggleStatus(Menu $menu): RedirectResponse
    {
        $menu->update(['status' => ! $menu->status]);

        ActivityLogger::log(
            'status_changed',
            'menu',
            $menu->id,
            "Menu #{$menu->id} status changed to ".($menu->status ? 'enabled' : 'disabled')
        );

        return redirect()->back()->with('success', 'Menu status updated.');
    }
}
