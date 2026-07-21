<?php

namespace Database\Seeders;

use App\Models\Banner;
use Illuminate\Database\Seeder;

class BannersSeeder extends Seeder
{
    public function run(): void
    {
        Banner::firstOrCreate(
            ['position' => 'home_hero'],
            [
                'title' => 'Fresh Arrivals Online',
                'subtitle' => 'Discover Our Newest Collection Today.',
                'image' => 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80',
                'link' => '/products',
                'button_text' => 'View Collection',
                'position' => 'home_hero',
                'sort_order' => 0,
                'status' => true,
            ]
        );
    }
}
