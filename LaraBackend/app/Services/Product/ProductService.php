<?php

namespace App\Services\Product;

use App\Exceptions\Product\ProductNotFoundException;
use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Support\ActivityLogger;
use Illuminate\Support\Str;

class ProductService
{
    public function __construct(
        private readonly ProductRepositoryInterface $productRepository
    ) {}

    public function create(array $data): Product
    {
        $data['slug'] = $this->generateUniqueSlug($data['slug'] ?? $data['name']);

        $product = $this->productRepository->create($data);

        ActivityLogger::log('created', Product::class, $product->id, "Created product \"{$product->name}\".");

        return $product;
    }

    public function update(int $id, array $data): Product
    {
        $product = $this->findOrFail($id);

        if (! empty($data['name'])) {
            $data['slug'] = $this->generateUniqueSlug($data['name'], $product->id);
        }

        $updated = $this->productRepository->update($product, $data);

        ActivityLogger::log('updated', Product::class, $updated->id, "Updated product \"{$updated->name}\".");

        return $updated;
    }

    public function delete(int $id): void
    {
        $product = $this->findOrFail($id);

        $this->productRepository->delete($product);

        ActivityLogger::log('deleted', Product::class, $id, "Deleted product \"{$product->name}\".");
    }

    public function toggleStatus(int $id): Product
    {
        $product = $this->findOrFail($id);

        $updated = $this->productRepository->update($product, ['status' => ! $product->status]);

        $state = $updated->status ? 'enabled' : 'disabled';
        ActivityLogger::log('status', Product::class, $updated->id, "Product \"{$updated->name}\" {$state}.");

        return $updated;
    }

    public function bulkSetStatus(array $ids, bool $status): int
    {
        $count = $this->productRepository->updateStatusForIds($ids, $status);

        $state = $status ? 'enabled' : 'disabled';
        ActivityLogger::log('bulk-status', Product::class, null, "Bulk {$state} {$count} product(s).");

        return $count;
    }

    public function bulkDelete(array $ids): int
    {
        $count = $this->productRepository->deleteByIds($ids);

        ActivityLogger::log('bulk-delete', Product::class, null, "Bulk deleted {$count} product(s).");

        return $count;
    }

    private function findOrFail(int $id): Product
    {
        $product = $this->productRepository->findById($id);

        if (! $product) {
            throw new ProductNotFoundException;
        }

        return $product;
    }

    private function generateUniqueSlug(string $source, ?int $ignoreId = null): string
    {
        $base = Str::slug($source);
        $slug = $base;
        $suffix = 1;

        while ($this->productRepository->slugExists($slug, $ignoreId)) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
