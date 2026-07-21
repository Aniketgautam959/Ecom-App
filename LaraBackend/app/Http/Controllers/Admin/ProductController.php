<?php

namespace App\Http\Controllers\Admin;

use App\Exceptions\Product\ProductNotFoundException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Repositories\Contracts\BrandRepositoryInterface;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Services\Product\ProductMediaService;
use App\Services\Product\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        private readonly ProductService $productService,
        private readonly ProductMediaService $productMediaService,
        private readonly ProductRepositoryInterface $productRepository,
        private readonly CategoryRepositoryInterface $categoryRepository,
        private readonly BrandRepositoryInterface $brandRepository,
    ) {}

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status', 'category_id', 'brand_id']);
        $products = $this->productRepository->paginate(10, $filters);
        $categories = $this->categoryRepository->all();
        $brands = $this->brandRepository->all();

        return view('admin.products.index', compact('products', 'filters', 'categories', 'brands'));
    }

    public function create()
    {
        $categories = $this->categoryRepository->all();
        $brands = $this->brandRepository->all();

        return view('admin.products.create', compact('categories', 'brands'));
    }

    public function store(StoreProductRequest $request)
    {
        $data = $this->productFields($request);

        $product = $this->productService->create($data);

        $this->syncMedia($product, $request);
        $this->syncVariants($product, $request);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(int $id)
    {
        $product = $this->productRepository->findById($id);

        if (! $product) {
            return redirect()->route('admin.products.index')
                ->with('error', 'Product not found.');
        }

        $product->load('media');

        $categories = $this->categoryRepository->all();
        $brands = $this->brandRepository->all();

        return view('admin.products.edit', compact('product', 'categories', 'brands'));
    }

    public function update(UpdateProductRequest $request, int $id)
    {
        try {
            $data = $this->productFields($request);

            $product = $this->productService->update($id, $data);

            $this->syncMedia($product, $request);
            $this->syncVariants($product, $request);

            return redirect()->route('admin.products.index')
                ->with('success', 'Product updated successfully.');
        } catch (ProductNotFoundException) {
            return redirect()->route('admin.products.index')
                ->with('error', 'Product not found.');
        }
    }

    /**
     * Extract only the persistable product attributes from the request.
     */
    private function productFields(StoreProductRequest|UpdateProductRequest $request): array
    {
        $data = $request->only(['name', 'category_id', 'brand_id', 'price', 'image']);
        $data['status'] = $request->boolean('status');

        return $data;
    }

    /**
     * Apply all media changes (delete, reorder, new uploads, video) for a product.
     */
    private function syncMedia(Product $product, Request $request): void
    {
        // 1. Remove media flagged for deletion.
        $this->productMediaService->deleteByIds($product, $request->input('remove_media', []));

        // 2. Reorder the remaining images.
        if ($request->filled('media_order')) {
            $this->productMediaService->reorderImages($product, $request->input('media_order', []));
        }

        // 3. Append newly uploaded images.
        if ($request->hasFile('images')) {
            $this->productMediaService->addImages($product, $request->file('images'));
        }

        // 4. Handle the product video.
        $videoSource = $request->input('video_source', 'none');

        if ($videoSource === 'upload' && $request->hasFile('video_file')) {
            $this->productMediaService->setVideoFile($product, $request->file('video_file'));
        } elseif ($videoSource === 'url' && $request->filled('video_url')) {
            $this->productMediaService->setVideoUrl($product, $request->input('video_url'));
        } elseif ($videoSource === 'none') {
            $this->productMediaService->removeVideo($product);
        }
    }

    /**
     * Sync product variants (sizes/colors/stock) from the submitted form.
     * Deletes all existing variants and re-creates from the submitted array.
     */
    private function syncVariants(Product $product, Request $request): void
    {
        $variants = $request->input('variants', []);

        // Remove old variants.
        $product->variants()->delete();

        // Recreate from submitted data.
        foreach ($variants as $variant) {
            // Skip empty rows.
            if (empty($variant['size']) && empty($variant['color_name']) && empty($variant['color_hex'])) {
                continue;
            }

            $product->variants()->create([
                'size'           => $variant['size'] ?? null,
                'color_name'     => $variant['color_name'] ?? null,
                'color_hex'      => $variant['color_hex'] ?? null,
                'price_override' => !empty($variant['price_override']) ? $variant['price_override'] : null,
                'stock'          => $variant['stock'] ?? 0,
            ]);
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->productService->delete($id);

            return redirect()->route('admin.products.index')
                ->with('success', 'Product deleted successfully.');
        } catch (ProductNotFoundException) {
            return redirect()->route('admin.products.index')
                ->with('error', 'Product not found.');
        }
    }

    public function toggleStatus(int $id)
    {
        try {
            $product = $this->productService->toggleStatus($id);
            $state = $product->status ? 'enabled' : 'disabled';

            return redirect()->back()->with('success', "Product {$state} successfully.");
        } catch (ProductNotFoundException) {
            return redirect()->back()->with('error', 'Product not found.');
        }
    }

    public function bulkAction(Request $request)
    {
        $request->validate([
            'action'     => ['required', 'in:enable,disable,delete'],
            'product_ids' => ['required', 'array', 'min:1'],
            'product_ids.*' => ['integer'],
        ]);

        $ids = $request->input('product_ids');
        $action = $request->input('action');

        match ($action) {
            'enable'  => $this->productService->bulkSetStatus($ids, true),
            'disable' => $this->productService->bulkSetStatus($ids, false),
            'delete'  => $this->productService->bulkDelete($ids),
        };

        return redirect()->route('admin.products.index')
            ->with('success', 'Bulk action applied successfully.');
    }
}
