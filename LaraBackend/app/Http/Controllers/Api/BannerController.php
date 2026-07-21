<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\JsonResponse;

class BannerController extends Controller
{
    public function index(): JsonResponse
    {
        $banners = Banner::active()
            ->orderBy('sort_order', 'asc')
            ->get();

        return response()->json(['data' => $banners]);
    }

    public function byPosition(string $position): JsonResponse
    {
        $banners = Banner::active()
            ->position($position)
            ->orderBy('sort_order', 'asc')
            ->get();

        return response()->json(['data' => $banners]);
    }
}
