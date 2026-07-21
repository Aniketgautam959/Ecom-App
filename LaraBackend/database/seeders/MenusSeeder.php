<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;

class MenusSeeder extends Seeder
{
    public function run(): void
    {
        $headerMenus = [
            ['label' => 'Shop All', 'url' => '/products', 'sort_order' => 1],
            ['label' => 'About', 'url' => '/about', 'sort_order' => 2],
            ['label' => 'Contact', 'url' => '/contact', 'sort_order' => 3],
        ];

        foreach ($headerMenus as $menu) {
            Menu::updateOrCreate(
                ['label' => $menu['label'], 'position' => 'header', 'parent_id' => null],
                array_merge($menu, ['position' => 'header', 'status' => true])
            );
        }

        $offers = Menu::updateOrCreate(
            ['label' => 'Offers', 'position' => 'header', 'parent_id' => null],
            ['url' => '#', 'sort_order' => 4, 'status' => true]
        );

        Menu::updateOrCreate(
            ['label' => 'Summer Sale', 'position' => 'header', 'parent_id' => $offers->id],
            ['url' => '/products', 'sort_order' => 1, 'status' => true]
        );

        Menu::updateOrCreate(
            ['label' => 'Best Sellers', 'position' => 'header', 'parent_id' => $offers->id],
            ['url' => '/products', 'sort_order' => 2, 'status' => true]
        );

        $footerMenus = [
            ['label' => 'FAQ', 'url' => '/faq', 'sort_order' => 1],
            ['label' => 'Terms of Use', 'url' => '/terms-conditions', 'sort_order' => 2],
            ['label' => 'Privacy Policy', 'url' => '/privacy-policy', 'sort_order' => 3],
            ['label' => 'About Us', 'url' => '/about', 'sort_order' => 4],
            ['label' => 'Contact', 'url' => '/contact', 'sort_order' => 5],
        ];

        foreach ($footerMenus as $menu) {
            Menu::updateOrCreate(
                ['label' => $menu['label'], 'position' => 'footer', 'parent_id' => null],
                array_merge($menu, ['position' => 'footer', 'status' => true])
            );
        }
    }
}
