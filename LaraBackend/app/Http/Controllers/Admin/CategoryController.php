<?php

namespace App\Http\Controllers\Admin;

use App\Exceptions\Category\CategoryNotFoundException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Models\Category;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\Services\Category\CategoryService;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryService $categoryService,
        private readonly CategoryRepositoryInterface $categoryRepository,
    ) {}

    public function index(Request $request): View
    {
        $filters = [
            'search' => $request->query('search'),
            'status' => $request->filled('status')
                ? $request->boolean('status')
                : null,
        ];

        $categories = $this->categoryRepository->paginate($filters, 10);
        $categories->appends($request->query());

        return view('admin.categories.index', [
            'categories' => $categories,
            'search' => $filters['search'],
            'status' => $request->query('status'),
        ]);
    }

    public function create(): View
    {
        return view('admin.categories.create', [
            'parents' => $this->parentOptions(),
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $this->categoryService->create($request->validated());

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function edit(int $id): View
    {
        $category = $this->findOrFail($id);

        return view('admin.categories.edit', [
            'category' => $category,
            'parents' => $this->parentOptions($id),
        ]);
    }

    public function update(UpdateCategoryRequest $request, int $id): RedirectResponse
    {
        $this->categoryService->update($id, $request->validated());

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->categoryService->delete($id);

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'Category deleted successfully.');
    }

    public function toggleStatus(int $id): RedirectResponse
    {
        $category = $this->findOrFail($id);

        $this->categoryRepository->update($category, ['status' => ! $category->status]);

        return redirect()
            ->back()
            ->with('success', 'Category status updated.');
    }

    private function findOrFail(int $id): Category
    {
        $category = $this->categoryRepository->findById($id);

        if (! $category) {
            throw new CategoryNotFoundException;
        }

        return $category;
    }

    private function parentOptions(?int $excludeId = null)
    {
        return Category::query()
            ->when($excludeId !== null, fn ($q) => $q->where('id', '!=', $excludeId))
            ->orderBy('name')
            ->get(['id', 'name']);
    }
}
