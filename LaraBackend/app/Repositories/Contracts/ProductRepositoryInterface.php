<?php

namespace App\Repositories\Contracts;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProductRepositoryInterface
{
    public function paginate(int $perPage, array $filters = []): LengthAwarePaginator;

    public function findById(int $id): ?Product;

    public function findBySlug(string $slug): ?Product;

    public function create(array $data): Product;

    public function update(Product $product, array $data): Product;

    public function delete(Product $product): void;

    public function updateStatusForIds(array $ids, bool $status): int;

    public function deleteByIds(array $ids): int;

    public function slugExists(string $slug, ?int $ignoreId = null): bool;

    public function allActive(array $filters = []): \Illuminate\Database\Eloquent\Collection;

    public function featured(int $limit = 4): \Illuminate\Database\Eloquent\Collection;

    public function latest(int $limit = 4): \Illuminate\Database\Eloquent\Collection;

    public function search(string $query): \Illuminate\Database\Eloquent\Collection;

    public function related(int $productId, int $limit = 4): \Illuminate\Database\Eloquent\Collection;
}
