<?php

namespace App\Http\Controllers\Admin;

use App\Exceptions\Brand\BrandNotFoundException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Brand\StoreBrandRequest;
use App\Http\Requests\Brand\UpdateBrandRequest;
use App\Models\Brand;
use App\Repositories\Contracts\BrandRepositoryInterface;
use App\Services\Brand\BrandService;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function __construct(
        private readonly BrandService $brandService,
        private readonly BrandRepositoryInterface $brandRepository,
    ) {}

    public function index(Request $request): View
    {
        $filters = [
            'search' => $request->query('search'),
            'status' => $request->filled('status')
                ? $request->boolean('status')
                : null,
        ];

        $brands = $this->brandRepository->paginate($filters, 10);
        $brands->appends($request->query());

        return view('admin.brands.index', [
            'brands' => $brands,
            'search' => $filters['search'],
            'status' => $request->query('status'),
        ]);
    }

    public function create(): View
    {
        return view('admin.brands.create');
    }

    public function store(StoreBrandRequest $request): RedirectResponse
    {
        $this->brandService->create($request->validated());

        return redirect()
            ->route('admin.brands.index')
            ->with('success', 'Brand created successfully.');
    }

    public function edit(int $id): View
    {
        return view('admin.brands.edit', [
            'brand' => $this->findOrFail($id),
        ]);
    }

    public function update(UpdateBrandRequest $request, int $id): RedirectResponse
    {
        $this->brandService->update($id, $request->validated());

        return redirect()
            ->route('admin.brands.index')
            ->with('success', 'Brand updated successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->brandService->delete($id);

        return redirect()
            ->route('admin.brands.index')
            ->with('success', 'Brand deleted successfully.');
    }

    public function toggleStatus(int $id): RedirectResponse
    {
        $this->brandService->toggleStatus($id);

        return redirect()
            ->back()
            ->with('success', 'Brand status updated.');
    }

    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'action' => ['required', 'in:enable,disable,delete'],
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:brands,id'],
        ]);

        $ids = $validated['ids'];

        $message = match ($validated['action']) {
            'enable' => $this->brandService->bulkSetStatus($ids, true).' brand(s) enabled.',
            'disable' => $this->brandService->bulkSetStatus($ids, false).' brand(s) disabled.',
            'delete' => $this->brandService->bulkDelete($ids).' brand(s) deleted.',
        };

        return redirect()
            ->route('admin.brands.index')
            ->with('success', $message);
    }

    private function findOrFail(int $id): Brand
    {
        $brand = $this->brandRepository->findById($id);

        if (! $brand) {
            throw new BrandNotFoundException;
        }

        return $brand;
    }
}
