<?php

namespace App\Repositories;

use App\Models\Brand;
use App\Repositories\Contracts\BrandRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class BrandRepository implements BrandRepositoryInterface
{
    /**
     * @param  array<string, mixed>  $filters
     */
    public function paginate(array $filters, int $perPage): LengthAwarePaginator
    {
        $query = Brand::query();

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if (array_key_exists('status', $filters) && $filters['status'] !== null) {
            $query->where('status', $filters['status']);
        }

        return $query
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->paginate($perPage);
    }

    public function findById(int $id): ?Brand
    {
        return Brand::find($id);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Brand
    {
        return Brand::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Brand $brand, array $data): Brand
    {
        $brand->update($data);

        return $brand->fresh();
    }

    public function delete(Brand $brand): void
    {
        $brand->delete();
    }

    /**
     * @param  array<int>  $ids
     */
    public function updateStatusForIds(array $ids, bool $status): int
    {
        return Brand::whereIn('id', $ids)->update(['status' => $status]);
    }

    /**
     * @param  array<int>  $ids
     */
    public function deleteByIds(array $ids): int
    {
        return Brand::whereIn('id', $ids)->delete();
    }

    public function slugExists(string $slug, ?int $ignoreId = null): bool
    {
        return Brand::where('slug', $slug)
            ->when($ignoreId !== null, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists();
    }

    public function all(): \Illuminate\Database\Eloquent\Collection
    {
        return Brand::where('status', true)->orderBy('name')->get();
    }
}
