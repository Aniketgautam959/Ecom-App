<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategoriesSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'T-Shirts', 'description' => 'Casual and stylish t-shirts for everyday wear.'],
            ['name' => 'Shirts', 'description' => 'Formal and casual shirts for all occasions.'],
            ['name' => 'Jeans', 'description' => 'Denim jeans in various fits and styles.'],
            ['name' => 'Trousers', 'description' => 'Comfortable trousers for work and leisure.'],
            ['name' => 'Jackets', 'description' => 'Trendy jackets and outerwear.'],
            ['name' => 'Hoodies', 'description' => 'Cozy hoodies and sweatshirts.'],
            ['name' => 'Shorts', 'description' => 'Casual shorts for summer.'],
            ['name' => 'Footwear', 'description' => 'Shoes, sneakers, and sandals.'],
            ['name' => 'Accessories', 'description' => 'Bags, belts, caps, and more.'],
            ['name' => 'Watches', 'description' => 'Stylish wrist watches.'],
        ];

        foreach ($categories as $category) {
            $slug = Str::slug($category['name']);
            Category::firstOrCreate(
                ['slug' => $slug],
                [
                    'name' => $category['name'],
                    'description' => $category['description'],
                    'image' => null,
                    'status' => true,
                    'sort_order' => 0,
                ]
            );
        }
    }
}
