<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\JsonResponse;

class MenuController extends Controller
{
    public function byPosition(string $position): JsonResponse
    {
        $menus = Menu::active()
            ->position($position)
            ->whereNull('parent_id')
            ->with(['children' => fn ($q) => $q->active()])
            ->orderBy('sort_order', 'asc')
            ->get();

        return response()->json(['data' => $menus]);
    }
}
