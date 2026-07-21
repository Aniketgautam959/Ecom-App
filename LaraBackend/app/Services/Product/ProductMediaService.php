<?php

namespace App\Services\Product;

use App\Models\Product;
use App\Models\ProductMedia;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Handles all product media (images + a single video) persistence.
 *
 * The service is intentionally generic: it exposes small, composable
 * operations (add image, set video, reorder, delete) so it can be reused by
 * the admin panel, API endpoints, importers or seeders alike.
 */
class ProductMediaService
{
    private const DISK = 'public';

    private const IMAGE_DIR = 'products/images';

    private const VIDEO_DIR = 'products/videos';

    /**
     * Store an uploaded image and attach it to the product at the end of the
     * current gallery order.
     */
    public function addImage(Product $product, UploadedFile $file): ProductMedia
    {
        $path = $file->store(self::IMAGE_DIR, self::DISK);

        return $product->media()->create([
            'type'        => 'image',
            'path'        => $path,
            'disk'        => self::DISK,
            'is_external' => false,
            'sort_order'  => $this->nextImageSortOrder($product),
        ]);
    }

    /**
     * Store multiple uploaded images in the given order.
     *
     * @param  array<int, UploadedFile>  $files
     * @return array<int, ProductMedia>
     */
    public function addImages(Product $product, array $files): array
    {
        $created = [];

        foreach ($files as $file) {
            if ($file instanceof UploadedFile && $file->isValid()) {
                $created[] = $this->addImage($product, $file);
            }
        }

        return $created;
    }

    /**
     * Replace the product video with an uploaded file.
     */
    public function setVideoFile(Product $product, UploadedFile $file): ProductMedia
    {
        $this->removeVideo($product);

        $path = $file->store(self::VIDEO_DIR, self::DISK);

        return $product->media()->create([
            'type'        => 'video',
            'path'        => $path,
            'disk'        => self::DISK,
            'is_external' => false,
            'sort_order'  => 0,
        ]);
    }

    /**
     * Replace the product video with an external URL.
     */
    public function setVideoUrl(Product $product, string $url): ProductMedia
    {
        $this->removeVideo($product);

        return $product->media()->create([
            'type'        => 'video',
            'path'        => $url,
            'disk'        => self::DISK,
            'is_external' => true,
            'sort_order'  => 0,
        ]);
    }

    /**
     * Remove the current product video (and its stored file, if local).
     */
    public function removeVideo(Product $product): void
    {
        $product->media()->where('type', 'video')->get()
            ->each(fn (ProductMedia $media) => $this->deleteMedia($media));
    }

    /**
     * Delete a set of media items belonging to the product by id.
     *
     * @param  array<int, int|string>  $ids
     */
    public function deleteByIds(Product $product, array $ids): void
    {
        if (empty($ids)) {
            return;
        }

        $product->media()->whereIn('id', $ids)->get()
            ->each(fn (ProductMedia $media) => $this->deleteMedia($media));
    }

    /**
     * Persist a new order for the product's images.
     *
     * @param  array<int, int|string>  $orderedIds  Media ids in the desired order.
     */
    public function reorderImages(Product $product, array $orderedIds): void
    {
        $position = 0;

        foreach ($orderedIds as $id) {
            $product->media()
                ->where('type', 'image')
                ->where('id', $id)
                ->update(['sort_order' => $position++]);
        }
    }

    /**
     * Delete a single media record along with its underlying file.
     */
    public function deleteMedia(ProductMedia $media): void
    {
        if (! $media->is_external && $media->path) {
            Storage::disk($media->disk ?: self::DISK)->delete($media->path);
        }

        $media->delete();
    }

    private function nextImageSortOrder(Product $product): int
    {
        return (int) $product->media()->where('type', 'image')->max('sort_order') + 1;
    }
}
