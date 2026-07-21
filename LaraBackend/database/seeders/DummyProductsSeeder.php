<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DummyProductsSeeder extends Seeder
{
    public function run(): void
    {
        $category = \App\Models\Category::where('slug', 't-shirts')->first();
        $brand = \App\Models\Brand::where('slug', 'urban-thread')->first();

        if (! $category || ! $brand) {
            $this->command->warn('Required category (t-shirts) or brand (urban-thread) not found. Run CategoriesSeeder and BrandsSeeder first.');
            return;
        }

        $categoryId = $category->id;
        $brandId = $brand->id;

        $tshirts = [
            ['name' => 'Classic White Crew Neck Tee', 'price' => 499],
            ['name' => 'Black Oversized Street Tee', 'price' => 699],
            ['name' => 'Navy Blue Slim Fit T-Shirt', 'price' => 549],
            ['name' => 'Grey Melange Cotton Tee', 'price' => 399],
            ['name' => 'Olive Green Cargo Pocket Tee', 'price' => 799],
            ['name' => 'Burgundy Premium V-Neck', 'price' => 649],
            ['name' => 'Sky Blue Henley T-Shirt', 'price' => 599],
            ['name' => 'Charcoal Acid Wash Tee', 'price' => 899],
            ['name' => 'Mustard Yellow Graphic Print Tee', 'price' => 749],
            ['name' => 'Forest Green Relaxed Fit Tee', 'price' => 549],
            ['name' => 'Coral Pink Summer Tee', 'price' => 499],
            ['name' => 'Lavender Pastel Crew Neck', 'price' => 599],
            ['name' => 'Stone Washed Vintage Tee', 'price' => 849],
            ['name' => 'Midnight Black V-Neck Slim', 'price' => 649],
            ['name' => 'Ocean Blue Tie-Dye Tee', 'price' => 999],
            ['name' => 'Cream Beige Essential Tee', 'price' => 449],
            ['name' => 'Rust Orange Pocket Tee', 'price' => 549],
            ['name' => 'Sage Green Linen Blend Tee', 'price' => 899],
            ['name' => 'Powder Blue Athletic Fit', 'price' => 699],
            ['name' => 'Heather Grey Long Line Tee', 'price' => 599],
            ['name' => 'Wine Red Premium Cotton Tee', 'price' => 749],
            ['name' => 'Teal Blue Round Neck Tee', 'price' => 499],
            ['name' => 'Sand Color Boxy Fit Tee', 'price' => 649],
            ['name' => 'Electric Blue Performance Tee', 'price' => 899],
            ['name' => 'Moss Green Everyday Tee', 'price' => 399],
            ['name' => 'Slate Grey Textured Tee', 'price' => 549],
            ['name' => 'Ivory White Organic Cotton Tee', 'price' => 799],
            ['name' => 'Caramel Brown Drop Shoulder', 'price' => 749],
            ['name' => 'Indigo Blue Washed Tee', 'price' => 649],
            ['name' => 'Peach Color Comfort Tee', 'price' => 499],
            ['name' => 'Dark Olive Military Tee', 'price' => 599],
            ['name' => 'Lilac Purple Relaxed Tee', 'price' => 549],
            ['name' => 'Steel Blue Tech Fabric Tee', 'price' => 999],
            ['name' => 'Warm Taupe Classic Fit', 'price' => 599],
            ['name' => 'Brick Red Retro Stripe Tee', 'price' => 849],
            ['name' => 'Cool Mint Lightweight Tee', 'price' => 499],
            ['name' => 'Espresso Brown Suede Touch', 'price' => 1099],
            ['name' => 'Arctic White Performance Tee', 'price' => 749],
            ['name' => 'Dusty Rose Soft Touch Tee', 'price' => 599],
            ['name' => 'Cobalt Blue Color Block Tee', 'price' => 699],
            ['name' => 'Ash Grey Minimalist Tee', 'price' => 449],
            ['name' => 'Copper Tone Washed Tee', 'price' => 649],
            ['name' => 'Royal Blue Athletic Tee', 'price' => 799],
            ['name' => 'Off-White Vintage Print Tee', 'price' => 699],
            ['name' => 'Graphite Black Zip Detail Tee', 'price' => 949],
            ['name' => 'Lemon Yellow Casual Tee', 'price' => 449],
            ['name' => 'Plum Purple Crew Neck', 'price' => 599],
            ['name' => 'Khaki Green Utility Tee', 'price' => 699],
            ['name' => 'Jet Black Essential Pack Tee', 'price' => 399],
            ['name' => 'Cloud Grey Ultra Soft Tee', 'price' => 549],
        ];

        // Verified Unsplash t-shirt photo IDs (free, reliable)
        $imageIds = [
            '1693275542358-29602edf6088',
            '1763380631290-1fcdb1353794',
            '1772549145407-dd62ea2ba581',
            '1571945153237-4929e783af4a',
            '1620799139652-715e4d5b232d',
            '1618354691438-25bc04584c23',
            '1600328759671-85927887458d',
            '1615065137920-bef75ea862b7',
            '1549048085-69f77c42fe9b',
            '1623366302587-b38b1ddaefd9',
            '1572021335469-31706a17aaef',
        ];

        $sizes = ['S', 'M', 'L', 'XL', 'XXL'];
        $colors = [
            ['name' => 'White', 'hex' => '#ffffff'],
            ['name' => 'Black', 'hex' => '#1a1a1a'],
            ['name' => 'Navy', 'hex' => '#1e3a5f'],
            ['name' => 'Grey', 'hex' => '#6b7280'],
        ];

        foreach ($tshirts as $i => $tshirt) {
            // Find existing product by name so re-running updates images instead of duplicating
            $existing = Product::where('name', $tshirt['name'])
                ->where('category_id', $categoryId)
                ->first();

            // Ensure unique slug
            $slug = Str::slug($tshirt['name']);
            $baseSlug = $slug;
            $count = 1;
            while (Product::where('slug', $slug)
                ->when($existing, fn ($q) => $q->where('id', '!=', $existing->id))
                ->exists()) {
                $slug = $baseSlug . '-' . $count++;
            }

            $imageId = $imageIds[$i % count($imageIds)];
            $image = "https://images.unsplash.com/photo-{$imageId}?w=600&h=800&fit=crop&q=80";

            $product = Product::updateOrCreate(
                ['name' => $tshirt['name'], 'category_id' => $categoryId],
                [
                    'slug'     => $slug,
                    'brand_id' => $brandId,
                    'price'    => $tshirt['price'],
                    'image'    => $image,
                    'status'   => true,
                ]
            );

            // Add variants only for newly created products
            if ($product->wasRecentlyCreated) {
                $productColors = collect($colors)->random(2)->all();
                foreach ($sizes as $size) {
                    foreach ($productColors as $color) {
                        ProductVariant::create([
                            'product_id' => $product->id,
                            'size'       => $size,
                            'color_name' => $color['name'],
                            'color_hex'  => $color['hex'],
                            'stock'      => rand(5, 50),
                        ]);
                    }
                }
            }
        }

        $this->command->info('✅ Seeded/updated 50 T-shirt products!');
    }
}
