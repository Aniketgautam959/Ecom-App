<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tax;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Contracts\View\View;

class TaxController extends Controller
{
    public function index(Request $request): View
    {
        $query = Tax::query();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->query('search') . '%')
                  ->orWhere('country', 'like', '%' . $request->query('search') . '%');
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $taxes = $query->orderBy('created_at', 'desc')->paginate(10)->appends($request->query());

        return view('admin.taxes.index', [
            'taxes' => $taxes,
            'search' => $request->query('search'),
            'status' => $request->query('status'),
        ]);
    }

    public function create(): View
    {
        return view('admin.taxes.create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateRequest($request);

        if ($validated['is_default']) {
            Tax::query()->update(['is_default' => false]);
        }

        Tax::create($validated);

        return redirect()->route('admin.taxes.index')
            ->with('success', 'Tax created successfully.');
    }

    public function edit(int $id): View
    {
        $tax = Tax::findOrFail($id);
        return view('admin.taxes.edit', compact('tax'));
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $tax = Tax::findOrFail($id);
        $validated = $this->validateRequest($request, $id);

        if ($validated['is_default'] && ! $tax->is_default) {
            Tax::query()->update(['is_default' => false]);
        }

        $tax->update($validated);

        return redirect()->route('admin.taxes.index')
            ->with('success', 'Tax updated successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $tax = Tax::findOrFail($id);
        $tax->delete();

        return redirect()->route('admin.taxes.index')
            ->with('success', 'Tax deleted successfully.');
    }

    public function toggleStatus(int $id): RedirectResponse
    {
        $tax = Tax::findOrFail($id);
        $tax->update(['status' => ! $tax->status]);

        return redirect()->back()->with('success', 'Tax status updated.');
    }

    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'action' => ['required', 'in:enable,disable,delete'],
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:taxes,id'],
        ]);

        $ids = $validated['ids'];

        match ($validated['action']) {
            'enable' => Tax::whereIn('id', $ids)->update(['status' => true]),
            'disable' => Tax::whereIn('id', $ids)->update(['status' => false]),
            'delete' => Tax::whereIn('id', $ids)->delete(),
        };

        return redirect()->route('admin.taxes.index')
            ->with('success', 'Bulk action applied successfully.');
    }

    private function validateRequest(Request $request, ?int $ignoreId = null): array
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'rate' => ['required', 'numeric', 'min:0'],
            'country' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'is_default' => ['boolean'],
            'status' => ['boolean'],
        ]);

        $validated['is_default'] = $request->boolean('is_default');
        $validated['status'] = $request->boolean('status', true);

        return $validated;
    }
}
