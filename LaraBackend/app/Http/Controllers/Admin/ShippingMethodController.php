<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingMethod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Str;

class ShippingMethodController extends Controller
{
    public function index(Request $request): View
    {
        $query = ShippingMethod::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->query('search') . '%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $methods = $query->orderBy('sort_order')->paginate(10)->appends($request->query());

        return view('admin.shipping-methods.index', [
            'methods' => $methods,
            'search' => $request->query('search'),
            'status' => $request->query('status'),
        ]);
    }

    public function create(): View
    {
        return view('admin.shipping-methods.create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateRequest($request);

        if ($validated['is_default']) {
            ShippingMethod::query()->update(['is_default' => false]);
        }

        ShippingMethod::create($validated);

        return redirect()->route('admin.shipping-methods.index')
            ->with('success', 'Shipping method created successfully.');
    }

    public function edit(int $id): View
    {
        $method = ShippingMethod::findOrFail($id);
        return view('admin.shipping-methods.edit', compact('method'));
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $method = ShippingMethod::findOrFail($id);
        $validated = $this->validateRequest($request, $id);

        if ($validated['is_default'] && ! $method->is_default) {
            ShippingMethod::query()->update(['is_default' => false]);
        }

        $method->update($validated);

        return redirect()->route('admin.shipping-methods.index')
            ->with('success', 'Shipping method updated successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $method = ShippingMethod::findOrFail($id);
        $method->delete();

        return redirect()->route('admin.shipping-methods.index')
            ->with('success', 'Shipping method deleted successfully.');
    }

    public function toggleStatus(int $id): RedirectResponse
    {
        $method = ShippingMethod::findOrFail($id);
        $method->update(['status' => ! $method->status]);

        return redirect()->back()->with('success', 'Shipping method status updated.');
    }

    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'action' => ['required', 'in:enable,disable,delete'],
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:shipping_methods,id'],
        ]);

        $ids = $validated['ids'];

        match ($validated['action']) {
            'enable' => ShippingMethod::whereIn('id', $ids)->update(['status' => true]),
            'disable' => ShippingMethod::whereIn('id', $ids)->update(['status' => false]),
            'delete' => ShippingMethod::whereIn('id', $ids)->delete(),
        };

        return redirect()->route('admin.shipping-methods.index')
            ->with('success', 'Bulk action applied successfully.');
    }

    private function validateRequest(Request $request, ?int $ignoreId = null): array
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:shipping_methods,slug' . ($ignoreId ? ",{$ignoreId}" : '')],
            'price' => ['required', 'numeric', 'min:0'],
            'free_threshold' => ['nullable', 'numeric', 'min:0'],
            'is_default' => ['boolean'],
            'status' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $validated['is_default'] = $request->boolean('is_default');
        $validated['status'] = $request->boolean('status', true);
        $validated['sort_order'] = (int) $request->input('sort_order', 0);

        return $validated;
    }
}
