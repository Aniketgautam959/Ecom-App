<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\DelhiveryController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\RazorpayController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\WishlistController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

Route::get('/brands', [BrandController::class, 'index']);
Route::get('/brands/{slug}', [BrandController::class, 'show']);

Route::get('/banners', [BannerController::class, 'index']);
Route::get('/banners/{position}', [BannerController::class, 'byPosition']);

Route::get('/menus/{position}', [MenuController::class, 'byPosition']);

Route::get('/settings/currency', function () {
    return response()->json([
        'data' => [
            'code'   => \App\Models\Setting::currencyCode(),
            'symbol' => \App\Models\Setting::currencySymbol(),
        ],
    ]);
});

Route::get('/settings/branding', function () {
    return response()->json([
        'data' => [
            'app_name' => \App\Models\Setting::get('app_name', config('app.name')),
            'logo' => \App\Models\Setting::get('logo'),
            'primary_color' => \App\Models\Setting::get('primary_color', '#5B3DF5'),
            'currency' => [
                'code' => \App\Models\Setting::currencyCode(),
                'symbol' => \App\Models\Setting::currencySymbol(),
            ],
        ],
    ]);
});

Route::get('/settings/checkout', function () {
    return response()->json([
        'data' => [
            'shipping_flat_rate' => (float) \App\Models\Setting::get('shipping_flat_rate', '50'),
            'shipping_free_threshold' => (float) \App\Models\Setting::get('shipping_free_threshold', '500'),
            'tax_rate' => (float) \App\Models\Setting::get('tax_rate', '18'),
            'razorpay_enabled' => \App\Models\Setting::get('razorpay_enabled', '1') === '1',
            'razorpay_key' => \App\Models\Setting::get('razorpay_key') ?: config('services.razorpay.key', ''),
        ],
    ]);
});

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'featured']);
Route::get('/products/latest', [ProductController::class, 'latest']);
Route::get('/products/search', [ProductController::class, 'search']);
Route::get('/products/{id}/related', [ProductController::class, 'related']);
Route::get('/products/{slug}', [ProductController::class, 'show']);

Route::post('/coupon/validate', [CouponController::class, 'validateCoupon']);

Route::post('/checkout/summary', [CheckoutController::class, 'summary']);

Route::post('/contact', [ContactController::class, 'store']);

Route::get('/pages', [PageController::class, 'index']);
Route::get('/pages/{slug}', [PageController::class, 'show']);

Route::get('/products/{productId}/reviews', [ReviewController::class, 'index']);

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

Route::post('/razorpay/webhook', [RazorpayController::class, 'webhook']);

Route::get('/delhivery/serviceability', [DelhiveryController::class, 'serviceability']);

/*
|--------------------------------------------------------------------------
| Protected API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'updateMe']);
    Route::post('/me/change-password', [AuthController::class, 'changePassword']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    Route::post('/products/{productId}/reviews', [ReviewController::class, 'store']);

    // Addresses
    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::put('/addresses/{id}', [AddressController::class, 'update']);
    Route::delete('/addresses/{id}', [AddressController::class, 'destroy']);
    Route::patch('/addresses/{id}/default', [AddressController::class, 'setDefault']);

    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [CheckoutController::class, 'placeOrder']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::get('/orders/{id}/track', [OrderController::class, 'track']);
    Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']);
    Route::post('/orders/{id}/ship', [OrderController::class, 'markShipped']);

    Route::get('/delhivery/track/{id}', [DelhiveryController::class, 'track']);
    Route::post('/delhivery/shipments/{id}', [DelhiveryController::class, 'createShipment']);

    // Razorpay / Payment
    Route::post('/razorpay/order', [RazorpayController::class, 'createOrder']);
    Route::post('/razorpay/verify', [RazorpayController::class, 'verify']);
    Route::post('/payment/success', [CheckoutController::class, 'paymentSuccess']);
    Route::post('/payment/failed', [CheckoutController::class, 'paymentFailed']);

    // Wishlist
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{productId}', [WishlistController::class, 'destroy']);

    // Cart
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    Route::delete('/cart', [CartController::class, 'clear']);

    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    Route::get('/coupons', [CouponController::class, 'index']);
    Route::post('/coupons', [CouponController::class, 'store']);
    Route::get('/coupons/{coupon}', [CouponController::class, 'show']);
    Route::put('/coupons/{coupon}', [CouponController::class, 'update']);
    Route::delete('/coupons/{coupon}', [CouponController::class, 'destroy']);
});
