<?php

namespace App\Repositories;

use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ProductRepository implements ProductRepositoryInterface
{
    public function paginate(int $perPage, array $filters = []): LengthAwarePaginator
    {
        $query = Product::with(['category', 'brand'])
            ->orderBy('created_at', 'desc');

        if (! empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        if (isset($filters['status']) && $filters['status'] !== '') {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (! empty($filters['brand_id'])) {
            $query->where('brand_id', $filters['brand_id']);
        }

        return $query->paginate($perPage);
    }

    public function findById(int $id): ?Product
    {
        return Product::with(['category', 'brand', 'media', 'variants'])->find($id);
    }

    public function findBySlug(string $slug): ?Product
    {
        return Product::with(['category', 'brand', 'media', 'variants'])->where('slug', $slug)->first();
    }

    public function create(array $data): Product
    {
        return Product::create($data);
    }

    public function update(Product $product, array $data): Product
    {
        $product->update($data);

        return $product->fresh(['category', 'brand', 'media', 'variants']);
    }

    public function delete(Product $product): void
    {
        $product->delete();
    }

    public function updateStatusForIds(array $ids, bool $status): int
    {
        return Product::whereIn('id', $ids)->update(['status' => $status]);
    }

    public function deleteByIds(array $ids): int
    {
        return Product::whereIn('id', $ids)->delete();
    }

    public function slugExists(string $slug, ?int $ignoreId = null): bool
    {
        $query = Product::where('slug', $slug);

        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }

        return $query->exists();
    }

    public function allActive(array $filters = []): Collection
    {
        $query = Product::with(['category', 'brand', 'media', 'variants'])->where('status', true);

        if (! empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }
        if (! empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }
        if (! empty($filters['brand_id'])) {
            $query->where('brand_id', $filters['brand_id']);
        }
        if (isset($filters['min_price']) && $filters['min_price'] !== '') {
            $query->where('price', '>=', $filters['min_price']);
        }
        if (isset($filters['max_price']) && $filters['max_price'] !== '') {
            $query->where('price', '<=', $filters['max_price']);
        }

        match ($filters['sort'] ?? '') {
            'price_asc'  => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'name_asc'   => $query->orderBy('name', 'asc'),
            default      => $query->orderBy('created_at', 'desc'),
        };

        return $query->get();
    }

    public function featured(int $limit = 4): Collection
    {
        return Product::with(['category', 'brand', 'media', 'variants'])
            ->where('status', true)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function latest(int $limit = 4): Collection
    {
        return Product::with(['category', 'brand', 'media', 'variants'])
            ->where('status', true)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function search(string $query): Collection
    {
        return Product::with(['category', 'brand', 'media', 'variants'])
            ->where('status', true)
            ->where('name', 'like', '%' . $query . '%')
            ->orderBy('name')
            ->get();
    }

    public function related(int $productId, int $limit = 4): Collection
    {
        $product = Product::find($productId);

        if (! $product) {
            return Product::with(['category', 'brand', 'media', 'variants'])
                ->where('status', true)
                ->limit($limit)
                ->get();
        }

        return Product::with(['category', 'brand', 'media', 'variants'])
            ->where('status', true)
            ->where('id', '!=', $productId)
            ->where(function ($query) use ($product) {
                $query->where('category_id', $product->category_id)
                      ->orWhere('brand_id', $product->brand_id);
            })
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }
}
