<?php

namespace App\Services\Category;

use App\Exceptions\Category\CategoryNotFoundException;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class CategoryService
{
    public function __construct(
        private readonly CategoryRepositoryInterface $categoryRepository
    ) {}

    /**
     * @param  array<string, mixed>  $filters
     */
    public function list(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $paginator = $this->categoryRepository->paginate($filters, $perPage);

        $paginator->getCollection()->transform(
            fn (Category $category) => new CategoryResource($category)
        );

        return $paginator;
    }

    public function getBySlug(string $slug): CategoryResource
    {
        $category = $this->categoryRepository->findBySlug($slug);

        if (! $category) {
            throw new CategoryNotFoundException;
        }

        return new CategoryResource($category);
    }

    public function getById(int $id): CategoryResource
    {
        $category = $this->categoryRepository->findById($id);

        if (! $category) {
            throw new CategoryNotFoundException;
        }

        return new CategoryResource($category);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): CategoryResource
    {
        $data['slug'] = $this->generateUniqueSlug(
            $data['slug'] ?? $data['name']
        );

        $category = $this->categoryRepository->create($data);

        return new CategoryResource($category);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data): CategoryResource
    {
        $category = $this->categoryRepository->findById($id);

        if (! $category) {
            throw new CategoryNotFoundException;
        }

        if (! empty($data['slug']) || ! empty($data['name'])) {
            $source = $data['slug'] ?? $data['name'] ?? $category->name;
            $data['slug'] = $this->generateUniqueSlug($source, $category->id);
        }

        $updated = $this->categoryRepository->update($category, $data);

        return new CategoryResource($updated);
    }

    public function delete(int $id): void
    {
        $category = $this->categoryRepository->findById($id);

        if (! $category) {
            throw new CategoryNotFoundException;
        }

        $this->categoryRepository->delete($category);
    }

    private function generateUniqueSlug(string $source, ?int $ignoreId = null): string
    {
        $base = Str::slug($source);
        $slug = $base;
        $suffix = 1;

        while ($this->categoryRepository->slugExists($slug, $ignoreId)) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
