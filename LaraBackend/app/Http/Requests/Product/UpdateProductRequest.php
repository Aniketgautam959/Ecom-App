<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:255'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'brand_id'    => ['nullable', 'integer', 'exists:brands,id'],
            'price'       => ['required', 'numeric', 'min:0'],
            'image'       => ['nullable', 'string', 'max:2048'],
            'status'      => ['boolean'],

            // Media gallery
            'images'          => ['nullable', 'array'],
            'images.*'        => ['image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
            'remove_media'    => ['nullable', 'array'],
            'remove_media.*'  => ['integer'],
            'media_order'     => ['nullable', 'array'],
            'media_order.*'   => ['integer'],
            'video_source'    => ['nullable', 'in:none,upload,url'],
            'video_file'      => ['nullable', 'file', 'mimetypes:video/mp4,video/webm,video/ogg', 'max:51200'],
            'video_url'       => ['nullable', 'url', 'max:2048'],

            // Product variants (sizes/colors)
            'variants'              => ['nullable', 'array'],
            'variants.*.size'       => ['nullable', 'string', 'max:50'],
            'variants.*.color_name' => ['nullable', 'string', 'max:50'],
            'variants.*.color_hex'  => ['nullable', 'string', 'max:7'],
            'variants.*.price_override' => ['nullable', 'numeric', 'min:0'],
            'variants.*.stock'      => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'  => 'Product name is required.',
            'price.required' => 'Price is required.',
            'price.numeric'  => 'Price must be a valid number.',
        ];
    }
}
