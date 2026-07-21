<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $addresses = Address::where('user_id', $request->user()->id)
            ->orderByDesc('is_default')
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['data' => $addresses]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'label'        => ['nullable', 'string', 'max:50'],
            'name'         => ['required', 'string', 'max:255'],
            'phone'        => ['required', 'string', 'max:20'],
            'address_line' => ['required', 'string', 'max:500'],
            'city'         => ['required', 'string', 'max:100'],
            'state'        => ['required', 'string', 'max:100'],
            'pincode'      => ['required', 'string', 'max:10'],
            'country'      => ['nullable', 'string', 'max:100'],
            'is_default'   => ['nullable', 'boolean'],
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['label'] = $validated['label'] ?? 'Home';
        $validated['country'] = $validated['country'] ?? 'India';

        // If this is set as default, unset other defaults
        if (!empty($validated['is_default'])) {
            Address::where('user_id', $request->user()->id)->update(['is_default' => false]);
        }

        // If this is the user's first address, make it default
        $count = Address::where('user_id', $request->user()->id)->count();
        if ($count === 0) {
            $validated['is_default'] = true;
        }

        $address = Address::create($validated);

        return response()->json(['data' => $address, 'message' => 'Address added.'], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $address = Address::where('user_id', $request->user()->id)->findOrFail($id);

        $validated = $request->validate([
            'label'        => ['nullable', 'string', 'max:50'],
            'name'         => ['required', 'string', 'max:255'],
            'phone'        => ['required', 'string', 'max:20'],
            'address_line' => ['required', 'string', 'max:500'],
            'city'         => ['required', 'string', 'max:100'],
            'state'        => ['required', 'string', 'max:100'],
            'pincode'      => ['required', 'string', 'max:10'],
            'country'      => ['nullable', 'string', 'max:100'],
            'is_default'   => ['nullable', 'boolean'],
        ]);

        if (!empty($validated['is_default'])) {
            Address::where('user_id', $request->user()->id)
                ->where('id', '!=', $id)
                ->update(['is_default' => false]);
        }

        $address->update($validated);

        return response()->json(['data' => $address, 'message' => 'Address updated.']);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $address = Address::where('user_id', $request->user()->id)->findOrFail($id);
        $address->delete();

        // If deleted was default, make the first remaining one default
        if ($address->is_default) {
            Address::where('user_id', $request->user()->id)
                ->first()
                ?->update(['is_default' => true]);
        }

        return response()->json(['message' => 'Address deleted.']);
    }

    public function setDefault(Request $request, int $id): JsonResponse
    {
        $address = Address::where('user_id', $request->user()->id)->findOrFail($id);

        Address::where('user_id', $request->user()->id)->update(['is_default' => false]);
        $address->update(['is_default' => true]);

        return response()->json(['message' => 'Default address updated.']);
    }
}
