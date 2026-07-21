<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\JsonResponse;

class PageController extends Controller
{
    public function show(string $slug): JsonResponse
    {
        $page = Page::active()->where('slug', $slug)->first();

        if (! $page) {
            return response()->json(['message' => 'Page not found.'], 404);
        }

        return response()->json(['data' => $page]);
    }

    public function index(): JsonResponse
    {
        $pages = Page::active()->orderBy('sort_order', 'asc')->get(['slug', 'title']);

        return response()->json(['data' => $pages]);
    }
}
