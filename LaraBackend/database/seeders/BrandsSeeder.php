<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BrandsSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            ['name' => 'Urban Thread', 'description' => 'Premium urban streetwear brand.'],
            ['name' => 'Cotton Classics', 'description' => 'Comfortable everyday essentials.'],
            ['name' => 'Denim Co.', 'description' => 'High-quality denim products.'],
            ['name' => 'SportFlex', 'description' => 'Athletic and performance wear.'],
            ['name' => 'LuxeLine', 'description' => 'Luxury fashion and accessories.'],
            ['name' => 'EcoWear', 'description' => 'Sustainable and eco-friendly clothing.'],
        ];

        foreach ($brands as $brand) {
            $slug = Str::slug($brand['name']);
            Brand::firstOrCreate(
                ['slug' => $slug],
                [
                    'name' => $brand['name'],
                    'description' => $brand['description'],
                    'logo' => null,
                    'status' => true,
                    'sort_order' => 0,
                ]
            );
        }
    }
}
