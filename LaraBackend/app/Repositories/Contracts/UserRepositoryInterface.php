<?php

namespace App\Repositories\Contracts;

use App\Models\User;

interface UserRepositoryInterface
{
    public function create(array $data): User;

    public function findByEmail(string $emailId): ?User;

    public function findById(int $id): ?User;

    public function update(User $user, array $data): User;
}
