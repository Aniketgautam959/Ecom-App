<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CategoriesSeeder::class,
            BrandsSeeder::class,
            DummyProductsSeeder::class,
            BannersSeeder::class,
            PagesSeeder::class,
            MenusSeeder::class,
        ]);
    }
}
