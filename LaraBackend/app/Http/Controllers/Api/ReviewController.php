<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * List approved reviews for a given product.
     */
    public function index(Request $request, int $productId): JsonResponse
    {
        $reviews = Review::with('user')
            ->where('product_id', $productId)
            ->where('is_approved', true)
            ->latest()
            ->get()
            ->map(fn (Review $r) => [
                'id'        => $r->id,
                'rating'    => $r->rating,
                'comment'   => $r->comment,
                'reviewer'  => $r->reviewer_name,
                'initials'  => $r->initials,
                'date'      => $r->created_at->diffForHumans(),
            ]);

        return response()->json(['data' => $reviews]);
    }

    /**
     * Store a new review (authenticated user).
     */
    public function store(Request $request, int $productId): JsonResponse
    {
        $validated = $request->validate([
            'rating'  => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string', 'min:3', 'max:2000'],
        ]);

        $review = Review::create([
            'product_id' => $productId,
            'user_id'    => $request->user()->id,
            'rating'     => $validated['rating'],
            'comment'    => $validated['comment'],
        ]);

        return response()->json([
            'message' => 'Review submitted successfully.',
            'data'    => [
                'id'       => $review->id,
                'rating'   => $review->rating,
                'comment'  => $review->comment,
                'reviewer' => $review->reviewer_name,
                'initials' => $review->initials,
                'date'     => $review->created_at->diffForHumans(),
            ],
        ], 201);
    }
}
