<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        private readonly ProductRepositoryInterface $productRepository
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'category_id', 'brand_id', 'min_price', 'max_price', 'sort']);
        $products = $this->productRepository->allActive($filters);

        return response()->json(['data' => $products]);
    }

    public function show(string $slug): JsonResponse
    {
        $product = $this->productRepository->findBySlug($slug);

        if (! $product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        return response()->json(['data' => $product]);
    }

    public function featured(): JsonResponse
    {
        $products = $this->productRepository->featured(4);

        return response()->json(['data' => $products]);
    }

    public function latest(): JsonResponse
    {
        $products = $this->productRepository->latest(4);

        return response()->json(['data' => $products]);
    }

    public function search(Request $request): JsonResponse
    {
        $request->validate(['q' => ['required', 'string', 'min:1']]);

        $products = $this->productRepository->search($request->input('q'));

        return response()->json(['data' => $products]);
    }

    public function related(int $id): JsonResponse
    {
        $products = $this->productRepository->related($id, 4);

        return response()->json(['data' => $products]);
    }
}
