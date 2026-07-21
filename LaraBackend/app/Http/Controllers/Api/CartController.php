<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $items = Cart::where('user_id', $request->user()->id)
            ->with(['product.category', 'product.brand', 'product.media'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn (Cart $c) => [
                'id'       => $c->product_id,
                'slug'     => $c->product?->slug,
                'name'     => $c->product?->name,
                'price'    => $c->product?->price,
                'image'    => $c->product?->main_image,
                'quantity' => $c->quantity,
                'size'     => $c->size,
                'color'    => $c->color,
            ])
            ->filter(fn (array $item) => $item['slug'] !== null)
            ->values();

        return response()->json([
            'data' => [
                'items'      => $items,
                'count'      => $items->sum('quantity'),
                'total'      => $items->sum(fn (array $i) => $i['price'] * $i['quantity']),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity'   => ['required', 'integer', 'min:1'],
            'size'       => ['nullable', 'string', 'max:50'],
            'color'      => ['nullable', 'string', 'max:50'],
        ]);

        $cart = Cart::firstOrNew([
            'user_id'    => $request->user()->id,
            'product_id' => $validated['product_id'],
            'size'       => $validated['size'] ?? null,
            'color'      => $validated['color'] ?? null,
        ]);

        if ($cart->exists) {
            $cart->quantity += (int) $validated['quantity'];
        } else {
            $cart->quantity = (int) $validated['quantity'];
        }

        $cart->save();

        return response()->json([
            'message' => 'Added to cart.',
            'data'    => $cart,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
            'size'     => ['nullable', 'string', 'max:50'],
            'color'    => ['nullable', 'string', 'max:50'],
        ]);

        Cart::where('user_id', $request->user()->id)
            ->where('product_id', $id)
            ->where('size', $validated['size'] ?? null)
            ->where('color', $validated['color'] ?? null)
            ->update(['quantity' => $validated['quantity']]);

        return response()->json(['message' => 'Cart updated.']);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $size  = $request->input('size');
        $color = $request->input('color');

        Cart::where('user_id', $request->user()->id)
            ->where('product_id', $id)
            ->when($size !== null, fn ($q) => $q->where('size', $size))
            ->when($color !== null, fn ($q) => $q->where('color', $color))
            ->delete();

        return response()->json(['message' => 'Removed from cart.']);
    }

    public function clear(Request $request): JsonResponse
    {
        Cart::where('user_id', $request->user()->id)->delete();

        return response()->json(['message' => 'Cart cleared.']);
    }
}
