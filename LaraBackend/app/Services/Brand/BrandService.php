<?php

namespace App\Services\Brand;

use App\Exceptions\Brand\BrandNotFoundException;
use App\Models\Brand;
use App\Repositories\Contracts\BrandRepositoryInterface;
use App\Support\ActivityLogger;
use Illuminate\Support\Str;

class BrandService
{
    public function __construct(
        private readonly BrandRepositoryInterface $brandRepository
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Brand
    {
        $data['slug'] = $this->generateUniqueSlug($data['slug'] ?? $data['name']);

        $brand = $this->brandRepository->create($data);

        ActivityLogger::log('created', Brand::class, $brand->id, "Created brand \"{$brand->name}\".");

        return $brand;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data): Brand
    {
        $brand = $this->findOrFail($id);

        if (! empty($data['slug']) || ! empty($data['name'])) {
            $source = $data['slug'] ?? $data['name'] ?? $brand->name;
            $data['slug'] = $this->generateUniqueSlug($source, $brand->id);
        }

        $updated = $this->brandRepository->update($brand, $data);

        ActivityLogger::log('updated', Brand::class, $updated->id, "Updated brand \"{$updated->name}\".");

        return $updated;
    }

    public function delete(int $id): void
    {
        $brand = $this->findOrFail($id);

        $this->brandRepository->delete($brand);

        ActivityLogger::log('deleted', Brand::class, $id, "Deleted brand \"{$brand->name}\".");
    }

    public function toggleStatus(int $id): Brand
    {
        $brand = $this->findOrFail($id);

        $updated = $this->brandRepository->update($brand, ['status' => ! $brand->status]);

        $state = $updated->status ? 'enabled' : 'disabled';
        ActivityLogger::log('status', Brand::class, $updated->id, "Brand \"{$updated->name}\" {$state}.");

        return $updated;
    }

    /**
     * @param  array<int>  $ids
     */
    public function bulkSetStatus(array $ids, bool $status): int
    {
        $count = $this->brandRepository->updateStatusForIds($ids, $status);

        $state = $status ? 'enabled' : 'disabled';
        ActivityLogger::log('bulk-status', Brand::class, null, "Bulk {$state} {$count} brand(s).");

        return $count;
    }

    /**
     * @param  array<int>  $ids
     */
    public function bulkDelete(array $ids): int
    {
        $count = $this->brandRepository->deleteByIds($ids);

        ActivityLogger::log('bulk-delete', Brand::class, null, "Bulk deleted {$count} brand(s).");

        return $count;
    }

    private function findOrFail(int $id): Brand
    {
        $brand = $this->brandRepository->findById($id);

        if (! $brand) {
            throw new BrandNotFoundException;
        }

        return $brand;
    }

    private function generateUniqueSlug(string $source, ?int $ignoreId = null): string
    {
        $base = Str::slug($source);
        $slug = $base;
        $suffix = 1;

        while ($this->brandRepository->slugExists($slug, $ignoreId)) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
