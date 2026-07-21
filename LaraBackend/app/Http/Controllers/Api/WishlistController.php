<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $items = Wishlist::where('user_id', $request->user()->id)
            ->with(['product.category', 'product.brand', 'product.media'])
            ->orderByDesc('created_at')
            ->get()
            ->filter(fn (Wishlist $w) => $w->product !== null)
            ->map(fn (Wishlist $w) => [
                'id'       => $w->product->id,
                'slug'     => $w->product->slug,
                'name'     => $w->product->name,
                'price'    => $w->product->price,
                'image'    => $w->product->main_image,
                'category' => $w->product->category
                    ? ['id' => $w->product->category->id, 'name' => $w->product->category->name]
                    : null,
                'brand'    => $w->product->brand
                    ? ['id' => $w->product->brand->id, 'name' => $w->product->brand->name]
                    : null,
            ])
            ->values();

        return response()->json(['data' => $items]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
        ]);

        Wishlist::firstOrCreate([
            'user_id'    => $request->user()->id,
            'product_id' => $validated['product_id'],
        ]);

        return response()->json(['message' => 'Added to wishlist.'], 201);
    }

    public function destroy(Request $request, int $productId): JsonResponse
    {
        Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $productId)
            ->delete();

        return response()->json(['message' => 'Removed from wishlist.']);
    }
}
