<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Contracts\View\View;

class RoleController extends Controller
{
    public function index(Request $request): View
    {
        $query = Role::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->query('search') . '%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $roles = $query->orderBy('name')->paginate(10)->appends($request->query());

        return view('admin.roles.index', [
            'roles' => $roles,
            'search' => $request->query('search'),
            'status' => $request->query('status'),
        ]);
    }

    public function create(): View
    {
        return view('admin.roles.create', ['permissions' => $this->permissionsList()]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateRequest($request);
        $validated['permissions'] = $this->permissionsFromRequest($request);

        Role::create($validated);

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role created successfully.');
    }

    public function edit(int $id): View
    {
        $role = Role::findOrFail($id);
        return view('admin.roles.edit', [
            'role' => $role,
            'permissions' => $this->permissionsList(),
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $role = Role::findOrFail($id);
        $validated = $this->validateRequest($request, $id);
        $validated['permissions'] = $this->permissionsFromRequest($request);

        $role->update($validated);

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role updated successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role deleted successfully.');
    }

    public function toggleStatus(int $id): RedirectResponse
    {
        $role = Role::findOrFail($id);
        $role->update(['status' => ! $role->status]);

        return redirect()->back()->with('success', 'Role status updated.');
    }

    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'action' => ['required', 'in:enable,disable,delete'],
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:roles,id'],
        ]);

        $ids = $validated['ids'];

        match ($validated['action']) {
            'enable' => Role::whereIn('id', $ids)->update(['status' => true]),
            'disable' => Role::whereIn('id', $ids)->update(['status' => false]),
            'delete' => Role::whereIn('id', $ids)->delete(),
        };

        return redirect()->route('admin.roles.index')
            ->with('success', 'Bulk action applied successfully.');
    }

    private function validateRequest(Request $request, ?int $ignoreId = null): array
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:roles,slug' . ($ignoreId ? ",{$ignoreId}" : '')],
            'description' => ['nullable', 'string'],
            'status' => ['boolean'],
        ]);

        $validated['status'] = $request->boolean('status', true);

        return $validated;
    }

    private function permissionsFromRequest(Request $request): array
    {
        $selected = $request->input('permissions', []);
        return is_array($selected) ? array_values($selected) : [];
    }

    private function permissionsList(): array
    {
        return [
            'dashboard',
            'products',
            'categories',
            'brands',
            'orders',
            'customers',
            'coupons',
            'reviews',
            'banners',
            'pages',
            'menus',
            'shipping',
            'payment_gateways',
            'taxes',
            'notifications',
            'settings',
            'roles',
            'audit_logs',
            'reports',
        ];
    }
}
