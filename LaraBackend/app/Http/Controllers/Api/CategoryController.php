<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Services\Category\CategoryService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryService $categoryService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = [
            'search' => $request->query('search'),
            'status' => $request->has('status')
                ? $request->boolean('status')
                : null,
            'parent_id' => $request->query('parent_id'),
        ];

        $perPage = (int) $request->query('per_page', 15);

        $categories = $this->categoryService->list($filters, $perPage);

        return ApiResponse::paginated($categories, 'Categories retrieved successfully.');
    }

    public function show(string $slug): JsonResponse
    {
        $category = $this->categoryService->getBySlug($slug);

        return ApiResponse::success($category, 'Category retrieved successfully.');
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = $this->categoryService->create($request->validated());

        return ApiResponse::success($category, 'Category created successfully.', 201);
    }

    public function update(UpdateCategoryRequest $request, int $id): JsonResponse
    {
        $category = $this->categoryService->update($id, $request->validated());

        return ApiResponse::success($category, 'Category updated successfully.');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->categoryService->delete($id);

        return ApiResponse::success(null, 'Category deleted successfully.');
    }
}
