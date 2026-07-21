<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\JsonResponse;

class BrandController extends Controller
{
    public function index(): JsonResponse
    {
        $brands = Brand::where('status', true)->orderBy('name')->get(['id', 'name', 'slug']);

        return response()->json(['data' => $brands]);
    }

    public function show(string $slug): JsonResponse
    {
        $brand = Brand::where('slug', $slug)->where('status', true)->first();

        if (! $brand) {
            return response()->json(['message' => 'Brand not found.'], 404);
        }

        return response()->json([
            'data' => [
                'id'          => $brand->id,
                'name'        => $brand->name,
                'slug'        => $brand->slug,
                'description' => $brand->description,
            ],
        ]);
    }
}
