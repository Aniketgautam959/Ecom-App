<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentGateway;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Contracts\View\View;

class PaymentGatewayController extends Controller
{
    public function index(Request $request): View
    {
        $query = PaymentGateway::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->query('search') . '%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $gateways = $query->orderBy('sort_order')->paginate(10)->appends($request->query());

        return view('admin.payment-gateways.index', [
            'gateways' => $gateways,
            'search' => $request->query('search'),
            'status' => $request->query('status'),
        ]);
    }

    public function create(): View
    {
        return view('admin.payment-gateways.create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateRequest($request);
        $validated['config'] = $this->parseConfig($request->input('config', ''));

        PaymentGateway::create($validated);

        return redirect()->route('admin.payment-gateways.index')
            ->with('success', 'Payment gateway created successfully.');
    }

    public function edit(int $id): View
    {
        $gateway = PaymentGateway::findOrFail($id);
        return view('admin.payment-gateways.edit', compact('gateway'));
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $gateway = PaymentGateway::findOrFail($id);
        $validated = $this->validateRequest($request, $id);
        $validated['config'] = $this->parseConfig($request->input('config', ''));

        $gateway->update($validated);

        return redirect()->route('admin.payment-gateways.index')
            ->with('success', 'Payment gateway updated successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $gateway = PaymentGateway::findOrFail($id);
        $gateway->delete();

        return redirect()->route('admin.payment-gateways.index')
            ->with('success', 'Payment gateway deleted successfully.');
    }

    public function toggleStatus(int $id): RedirectResponse
    {
        $gateway = PaymentGateway::findOrFail($id);
        $gateway->update(['status' => ! $gateway->status]);

        return redirect()->back()->with('success', 'Payment gateway status updated.');
    }

    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'action' => ['required', 'in:enable,disable,delete'],
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:payment_gateways,id'],
        ]);

        $ids = $validated['ids'];

        match ($validated['action']) {
            'enable' => PaymentGateway::whereIn('id', $ids)->update(['status' => true]),
            'disable' => PaymentGateway::whereIn('id', $ids)->update(['status' => false]),
            'delete' => PaymentGateway::whereIn('id', $ids)->delete(),
        };

        return redirect()->route('admin.payment-gateways.index')
            ->with('success', 'Bulk action applied successfully.');
    }

    private function validateRequest(Request $request, ?int $ignoreId = null): array
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:100', 'unique:payment_gateways,code' . ($ignoreId ? ",{$ignoreId}" : '')],
            'status' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $validated['status'] = $request->boolean('status', true);
        $validated['sort_order'] = (int) $request->input('sort_order', 0);

        return $validated;
    }

    private function parseConfig(string $config): array
    {
        $data = json_decode($config, true);
        return is_array($data) ? $data : [];
    }
}
