<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CouponController extends Controller
{
    public function validateCoupon(Request $request): JsonResponse
    {
        $request->validate([
            'code' => ['required', 'string'],
            'subtotal' => ['required', 'numeric', 'min:0'],
        ]);

        $coupon = Coupon::where('code', $request->input('code'))->first();

        if (! $coupon) {
            return ApiResponse::error('Invalid coupon code.', 422);
        }

        if (! $coupon->isActive()) {
            return ApiResponse::error('Coupon is not active or has expired.', 422);
        }

        $subtotal = (float) $request->input('subtotal');

        if ($subtotal < $coupon->min_order_amount) {
            return ApiResponse::error(
                "Minimum order amount of {$coupon->min_order_amount} is required for this coupon.",
                422
            );
        }

        $user = $request->user();
        if ($user && $coupon->per_user_limit !== null) {
            $usedByUser = DB::table('coupon_usages')
                ->where('coupon_id', $coupon->id)
                ->where('user_id', $user->id)
                ->count();

            if ($usedByUser >= $coupon->per_user_limit) {
                return ApiResponse::error('You have already used this coupon.', 422);
            }
        }

        $discount = $coupon->calculateDiscount($subtotal);
        $finalTotal = round(max(0, $subtotal - $discount), 2);

        return ApiResponse::success([
            'code' => $coupon->code,
            'description' => $coupon->description,
            'type' => $coupon->type,
            'value' => $coupon->value,
            'discount' => $discount,
            'final_total' => $finalTotal,
        ], 'Coupon applied successfully.');
    }

    public function index(Request $request): JsonResponse
    {
        $coupons = Coupon::orderBy('created_at', 'desc')->paginate($request->input('per_page', 15));
        return ApiResponse::success($coupons);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'unique:coupons,code'],
            'description' => ['nullable', 'string'],
            'type' => ['required', Rule::in(['percentage', 'fixed'])],
            'value' => ['required', 'numeric', 'min:0'],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'max_discount' => ['nullable', 'numeric', 'min:0'],
            'starts_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'per_user_limit' => ['nullable', 'integer', 'min:1'],
            'status' => ['boolean'],
        ]);

        $coupon = Coupon::create($validated);

        return ApiResponse::success($coupon, 'Coupon created successfully.', 201);
    }

    public function show(Coupon $coupon): JsonResponse
    {
        return ApiResponse::success($coupon);
    }

    public function update(Request $request, Coupon $coupon): JsonResponse
    {
        $validated = $request->validate([
            'code' => ['nullable', 'string', Rule::unique('coupons', 'code')->ignore($coupon->id)],
            'description' => ['nullable', 'string'],
            'type' => ['nullable', Rule::in(['percentage', 'fixed'])],
            'value' => ['nullable', 'numeric', 'min:0'],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'max_discount' => ['nullable', 'numeric', 'min:0'],
            'starts_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'per_user_limit' => ['nullable', 'integer', 'min:1'],
            'status' => ['boolean'],
        ]);

        $coupon->update(array_filter($validated, fn ($v) => $v !== null));

        return ApiResponse::success($coupon, 'Coupon updated successfully.');
    }

    public function destroy(Coupon $coupon): JsonResponse
    {
        $coupon->delete();

        return ApiResponse::success(null, 'Coupon deleted successfully.');
    }
}
