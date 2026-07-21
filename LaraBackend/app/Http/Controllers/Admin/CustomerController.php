<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\ActivityLogger;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request): View
    {
        $query = User::query();

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email_id', 'like', "%{$search}%")
                  ->orWhere('phone_number', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $customers = $query->withCount('orders')->latest()->paginate(15)->appends($request->query());

        return view('admin.customers.index', [
            'customers' => $customers,
            'search' => $request->query('search'),
            'status' => $request->query('status'),
        ]);
    }

    public function show(User $customer): View
    {
        $customer->loadCount(['orders', 'wishlistItems']);

        return view('admin.customers.show', compact('customer'));
    }

    public function toggleStatus(User $customer): RedirectResponse
    {
        $customer->update(['status' => ! $customer->status]);

        ActivityLogger::log(
            'status_changed',
            'customer',
            $customer->id,
            "Customer #{$customer->id} status changed to ".($customer->status ? 'enabled' : 'disabled')
        );

        return redirect()
            ->back()
            ->with('success', 'Customer status updated.');
    }

    public function destroy(User $customer): RedirectResponse
    {
        $id = $customer->id;
        $customer->delete();

        ActivityLogger::log(
            'deleted',
            'customer',
            $id,
            "Deleted customer #{$id}"
        );

        return redirect()
            ->route('admin.customers.index')
            ->with('success', 'Customer deleted successfully.');
    }
}
