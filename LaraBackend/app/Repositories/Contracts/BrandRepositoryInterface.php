<?php

namespace App\Repositories\Contracts;

use App\Models\Brand;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface BrandRepositoryInterface
{
    /**
     * @param  array<string, mixed>  $filters
     */
    public function paginate(array $filters, int $perPage): LengthAwarePaginator;

    public function findById(int $id): ?Brand;

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Brand;

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Brand $brand, array $data): Brand;

    public function delete(Brand $brand): void;

    /**
     * @param  array<int>  $ids
     */
    public function updateStatusForIds(array $ids, bool $status): int;

    /**
     * @param  array<int>  $ids
     */
    public function deleteByIds(array $ids): int;

    public function slugExists(string $slug, ?int $ignoreId = null): bool;

    public function all(): \Illuminate\Database\Eloquent\Collection;
}
