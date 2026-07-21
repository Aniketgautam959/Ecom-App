<?php

use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\Auth\LoginController;
use App\Http\Controllers\Admin\Auth\RegisteredUserController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CmsPageController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MenuController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PaymentGatewayController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\ShippingMethodController;
use App\Http\Controllers\Admin\TaxController;
use App\Http\Middleware\NoCache;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->middleware('guest:admin')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])->name('admin.register');
    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [LoginController::class, 'create'])->name('admin.login');
    Route::post('login', [LoginController::class, 'store']);
});

Route::prefix('admin')->middleware(['auth:admin', NoCache::class])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
    Route::post('logout', [LoginController::class, 'destroy'])->name('admin.logout');

    Route::get('categories', [CategoryController::class, 'index'])->name('admin.categories.index');
    Route::get('categories/create', [CategoryController::class, 'create'])->name('admin.categories.create');
    Route::post('categories', [CategoryController::class, 'store'])->name('admin.categories.store');
    Route::get('categories/{id}/edit', [CategoryController::class, 'edit'])->name('admin.categories.edit');
    Route::put('categories/{id}', [CategoryController::class, 'update'])->name('admin.categories.update');
    Route::delete('categories/{id}', [CategoryController::class, 'destroy'])->name('admin.categories.destroy');
    Route::patch('categories/{id}/toggle-status', [CategoryController::class, 'toggleStatus'])->name('admin.categories.toggle-status');

    Route::get('brands', [BrandController::class, 'index'])->name('admin.brands.index');
    Route::get('brands/create', [BrandController::class, 'create'])->name('admin.brands.create');
    Route::post('brands', [BrandController::class, 'store'])->name('admin.brands.store');
    Route::post('brands/bulk-action', [BrandController::class, 'bulkAction'])->name('admin.brands.bulk-action');
    Route::get('brands/{id}/edit', [BrandController::class, 'edit'])->name('admin.brands.edit');
    Route::put('brands/{id}', [BrandController::class, 'update'])->name('admin.brands.update');
    Route::delete('brands/{id}', [BrandController::class, 'destroy'])->name('admin.brands.destroy');
    Route::patch('brands/{id}/toggle-status', [BrandController::class, 'toggleStatus'])->name('admin.brands.toggle-status');

    Route::get('products', [ProductController::class, 'index'])->name('admin.products.index');
    Route::get('products/create', [ProductController::class, 'create'])->name('admin.products.create');
    Route::post('products', [ProductController::class, 'store'])->name('admin.products.store');
    Route::post('products/bulk-action', [ProductController::class, 'bulkAction'])->name('admin.products.bulk-action');
    Route::get('products/{id}/edit', [ProductController::class, 'edit'])->name('admin.products.edit');
    Route::put('products/{id}', [ProductController::class, 'update'])->name('admin.products.update');
    Route::delete('products/{id}', [ProductController::class, 'destroy'])->name('admin.products.destroy');
    Route::patch('products/{id}/toggle-status', [ProductController::class, 'toggleStatus'])->name('admin.products.toggle-status');

    Route::get('reviews', [ReviewController::class, 'index'])->name('admin.reviews.index');
    Route::patch('reviews/{id}/toggle-approval', [ReviewController::class, 'toggleApproval'])->name('admin.reviews.toggle-approval');
    Route::delete('reviews/{id}', [ReviewController::class, 'destroy'])->name('admin.reviews.destroy');

    Route::get('notifications', [NotificationController::class, 'index'])->name('admin.notifications.index');
    Route::get('notifications/create', [NotificationController::class, 'create'])->name('admin.notifications.create');
    Route::post('notifications', [NotificationController::class, 'store'])->name('admin.notifications.store');
    Route::get('notifications/{notification}/edit', [NotificationController::class, 'edit'])->name('admin.notifications.edit');
    Route::put('notifications/{notification}', [NotificationController::class, 'update'])->name('admin.notifications.update');
    Route::delete('notifications/{notification}', [NotificationController::class, 'destroy'])->name('admin.notifications.destroy');
    Route::patch('notifications/{notification}/toggle-status', [NotificationController::class, 'toggleStatus'])->name('admin.notifications.toggle-status');
    Route::post('notifications/bulk-action', [NotificationController::class, 'bulkAction'])->name('admin.notifications.bulk-action');

    Route::get('orders', [OrderController::class, 'index'])->name('admin.orders.index');
    Route::get('orders/{id}', [OrderController::class, 'show'])->name('admin.orders.show');
    Route::patch('orders/{id}/status', [OrderController::class, 'updateStatus'])->name('admin.orders.update-status');
    Route::post('orders/{id}/ship', [OrderController::class, 'ship'])->name('admin.orders.ship');

    Route::get('customers', [CustomerController::class, 'index'])->name('admin.customers.index');
    Route::get('customers/{customer}', [CustomerController::class, 'show'])->name('admin.customers.show');
    Route::patch('customers/{customer}/toggle-status', [CustomerController::class, 'toggleStatus'])->name('admin.customers.toggle-status');
    Route::delete('customers/{customer}', [CustomerController::class, 'destroy'])->name('admin.customers.destroy');

    Route::get('shipping-methods', [ShippingMethodController::class, 'index'])->name('admin.shipping-methods.index');
    Route::get('shipping-methods/create', [ShippingMethodController::class, 'create'])->name('admin.shipping-methods.create');
    Route::post('shipping-methods', [ShippingMethodController::class, 'store'])->name('admin.shipping-methods.store');
    Route::post('shipping-methods/bulk-action', [ShippingMethodController::class, 'bulkAction'])->name('admin.shipping-methods.bulk-action');
    Route::get('shipping-methods/{id}/edit', [ShippingMethodController::class, 'edit'])->name('admin.shipping-methods.edit');
    Route::put('shipping-methods/{id}', [ShippingMethodController::class, 'update'])->name('admin.shipping-methods.update');
    Route::delete('shipping-methods/{id}', [ShippingMethodController::class, 'destroy'])->name('admin.shipping-methods.destroy');
    Route::patch('shipping-methods/{id}/toggle-status', [ShippingMethodController::class, 'toggleStatus'])->name('admin.shipping-methods.toggle-status');

    Route::get('reports', [ReportController::class, 'index'])->name('admin.reports.index');

    Route::get('coupons', [CouponController::class, 'index'])->name('admin.coupons.index');
    Route::get('coupons/create', [CouponController::class, 'create'])->name('admin.coupons.create');
    Route::post('coupons', [CouponController::class, 'store'])->name('admin.coupons.store');
    Route::get('coupons/{coupon}/edit', [CouponController::class, 'edit'])->name('admin.coupons.edit');
    Route::put('coupons/{coupon}', [CouponController::class, 'update'])->name('admin.coupons.update');
    Route::delete('coupons/{coupon}', [CouponController::class, 'destroy'])->name('admin.coupons.destroy');
    Route::patch('coupons/{coupon}/toggle-status', [CouponController::class, 'toggleStatus'])->name('admin.coupons.toggle-status');

    Route::get('payment-gateways', [PaymentGatewayController::class, 'index'])->name('admin.payment-gateways.index');
    Route::get('payment-gateways/create', [PaymentGatewayController::class, 'create'])->name('admin.payment-gateways.create');
    Route::post('payment-gateways', [PaymentGatewayController::class, 'store'])->name('admin.payment-gateways.store');
    Route::post('payment-gateways/bulk-action', [PaymentGatewayController::class, 'bulkAction'])->name('admin.payment-gateways.bulk-action');
    Route::get('payment-gateways/{id}/edit', [PaymentGatewayController::class, 'edit'])->name('admin.payment-gateways.edit');
    Route::put('payment-gateways/{id}', [PaymentGatewayController::class, 'update'])->name('admin.payment-gateways.update');
    Route::delete('payment-gateways/{id}', [PaymentGatewayController::class, 'destroy'])->name('admin.payment-gateways.destroy');
    Route::patch('payment-gateways/{id}/toggle-status', [PaymentGatewayController::class, 'toggleStatus'])->name('admin.payment-gateways.toggle-status');

    Route::get('taxes', [TaxController::class, 'index'])->name('admin.taxes.index');
    Route::get('taxes/create', [TaxController::class, 'create'])->name('admin.taxes.create');
    Route::post('taxes', [TaxController::class, 'store'])->name('admin.taxes.store');
    Route::post('taxes/bulk-action', [TaxController::class, 'bulkAction'])->name('admin.taxes.bulk-action');
    Route::get('taxes/{id}/edit', [TaxController::class, 'edit'])->name('admin.taxes.edit');
    Route::put('taxes/{id}', [TaxController::class, 'update'])->name('admin.taxes.update');
    Route::delete('taxes/{id}', [TaxController::class, 'destroy'])->name('admin.taxes.destroy');
    Route::patch('taxes/{id}/toggle-status', [TaxController::class, 'toggleStatus'])->name('admin.taxes.toggle-status');

    Route::get('roles', [RoleController::class, 'index'])->name('admin.roles.index');
    Route::get('roles/create', [RoleController::class, 'create'])->name('admin.roles.create');
    Route::post('roles', [RoleController::class, 'store'])->name('admin.roles.store');
    Route::post('roles/bulk-action', [RoleController::class, 'bulkAction'])->name('admin.roles.bulk-action');
    Route::get('roles/{id}/edit', [RoleController::class, 'edit'])->name('admin.roles.edit');
    Route::put('roles/{id}', [RoleController::class, 'update'])->name('admin.roles.update');
    Route::delete('roles/{id}', [RoleController::class, 'destroy'])->name('admin.roles.destroy');
    Route::patch('roles/{id}/toggle-status', [RoleController::class, 'toggleStatus'])->name('admin.roles.toggle-status');

    Route::get('settings', [SettingController::class, 'index'])->name('admin.settings.index');
    Route::put('settings', [SettingController::class, 'update'])->name('admin.settings.update');

    Route::get('audit-logs', [AuditLogController::class, 'index'])->name('admin.audit-logs.index');

    Route::get('banners', [BannerController::class, 'index'])->name('admin.banners.index');
    Route::get('banners/create', [BannerController::class, 'create'])->name('admin.banners.create');
    Route::post('banners', [BannerController::class, 'store'])->name('admin.banners.store');
    Route::get('banners/{banner}/edit', [BannerController::class, 'edit'])->name('admin.banners.edit');
    Route::put('banners/{banner}', [BannerController::class, 'update'])->name('admin.banners.update');
    Route::delete('banners/{banner}', [BannerController::class, 'destroy'])->name('admin.banners.destroy');
    Route::patch('banners/{banner}/toggle-status', [BannerController::class, 'toggleStatus'])->name('admin.banners.toggle-status');

    Route::get('menus', [MenuController::class, 'index'])->name('admin.menus.index');
    Route::get('menus/create', [MenuController::class, 'create'])->name('admin.menus.create');
    Route::post('menus', [MenuController::class, 'store'])->name('admin.menus.store');
    Route::get('menus/{menu}/edit', [MenuController::class, 'edit'])->name('admin.menus.edit');
    Route::put('menus/{menu}', [MenuController::class, 'update'])->name('admin.menus.update');
    Route::delete('menus/{menu}', [MenuController::class, 'destroy'])->name('admin.menus.destroy');
    Route::patch('menus/{menu}/toggle-status', [MenuController::class, 'toggleStatus'])->name('admin.menus.toggle-status');

    Route::get('pages', [CmsPageController::class, 'index'])->name('admin.pages.index');
    Route::get('pages/create', [CmsPageController::class, 'create'])->name('admin.pages.create');
    Route::post('pages', [CmsPageController::class, 'store'])->name('admin.pages.store');
    Route::get('pages/{page}/edit', [CmsPageController::class, 'edit'])->name('admin.pages.edit');
    Route::put('pages/{page}', [CmsPageController::class, 'update'])->name('admin.pages.update');
    Route::delete('pages/{page}', [CmsPageController::class, 'destroy'])->name('admin.pages.destroy');
    Route::patch('pages/{page}/toggle-status', [CmsPageController::class, 'toggleStatus'])->name('admin.pages.toggle-status');
});
