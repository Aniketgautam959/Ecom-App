<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use App\Support\ActivityLogger;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class NotificationController extends Controller
{
    public function index(Request $request): View
    {
        $query = Notification::with(['user', 'actor']);

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        if ($request->filled('type')) {
            $query->where('type', $request->query('type'));
        }

        if ($request->filled('read')) {
            $query->where('read', $request->boolean('read'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->boolean('status'));
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->query('user_id'));
        }

        $notifications = $query->latest()->paginate(15)->appends($request->query());

        return view('admin.notifications.index', [
            'notifications' => $notifications,
            'users' => User::orderBy('first_name')
                ->get(['id', 'first_name', 'last_name', 'email_id']),
            'search' => $request->query('search'),
            'type' => $request->query('type'),
            'read' => $request->query('read'),
            'status' => $request->query('status'),
            'user_id' => $request->query('user_id'),
        ]);
    }

    public function create(): View
    {
        return view('admin.notifications.create', [
            'users' => User::orderBy('first_name')
                ->get(['id', 'first_name', 'last_name', 'email_id']),
            'types' => $this->notificationTypes(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateNotification($request);

        if ($validated['recipient'] === 'all') {
            $userIds = User::pluck('id');
        } else {
            $userIds = [$validated['user_id']];
        }

        foreach ($userIds as $userId) {
            Notification::create([
                'user_id' => $userId,
                'actor_id' => null,
                'type' => $validated['type'],
                'title' => $validated['title'],
                'message' => $validated['message'],
                'link' => $validated['link'],
                'read' => false,
                'status' => $validated['status'] ?? true,
            ]);
        }

        ActivityLogger::log(
            'created',
            'notification',
            null,
            "Created {$validated['type']} notification for ".($validated['recipient'] === 'all' ? 'all users' : "user #{$validated['user_id']}")
        );

        return redirect()
            ->route('admin.notifications.index')
            ->with('success', 'Notification sent successfully.');
    }

    public function edit(Notification $notification): View
    {
        return view('admin.notifications.edit', [
            'notification' => $notification,
            'users' => User::orderBy('first_name')
                ->get(['id', 'first_name', 'last_name', 'email_id']),
            'types' => $this->notificationTypes(),
        ]);
    }

    public function update(Request $request, Notification $notification): RedirectResponse
    {
        $validated = $this->validateNotification($request, $notification->id);

        $notification->update([
            'type' => $validated['type'],
            'title' => $validated['title'],
            'message' => $validated['message'],
            'link' => $validated['link'],
            'status' => $validated['status'] ?? $notification->status,
        ]);

        ActivityLogger::log(
            'updated',
            'notification',
            $notification->id,
            "Updated notification #{$notification->id}"
        );

        return redirect()
            ->route('admin.notifications.index')
            ->with('success', 'Notification updated successfully.');
    }

    public function destroy(Notification $notification): RedirectResponse
    {
        $id = $notification->id;
        $notification->delete();

        ActivityLogger::log(
            'deleted',
            'notification',
            $id,
            "Deleted notification #{$id}"
        );

        return redirect()
            ->route('admin.notifications.index')
            ->with('success', 'Notification deleted successfully.');
    }

    public function toggleStatus(Notification $notification): RedirectResponse
    {
        $notification->update(['status' => ! $notification->status]);

        ActivityLogger::log(
            'status_changed',
            'notification',
            $notification->id,
            "Notification #{$notification->id} status changed to ".($notification->status ? 'enabled' : 'disabled')
        );

        return redirect()
            ->back()
            ->with('success', 'Notification status updated.');
    }

    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'action' => ['required', 'in:read,unread,enable,disable,delete'],
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:notifications,id'],
        ]);

        $ids = $validated['ids'];
        $action = $validated['action'];

        switch ($action) {
            case 'read':
                Notification::whereIn('id', $ids)->update(['read' => true]);
                $message = count($ids).' notification(s) marked as read.';
                break;
            case 'unread':
                Notification::whereIn('id', $ids)->update(['read' => false]);
                $message = count($ids).' notification(s) marked as unread.';
                break;
            case 'enable':
                Notification::whereIn('id', $ids)->update(['status' => true]);
                $message = count($ids).' notification(s) enabled.';
                break;
            case 'disable':
                Notification::whereIn('id', $ids)->update(['status' => false]);
                $message = count($ids).' notification(s) disabled.';
                break;
            case 'delete':
                Notification::whereIn('id', $ids)->delete();
                $message = count($ids).' notification(s) deleted.';
                break;
        }

        ActivityLogger::log(
            'bulk_action',
            'notification',
            null,
            "Bulk action '{$action}' applied to notifications: ".implode(',', $ids)
        );

        return redirect()
            ->route('admin.notifications.index')
            ->with('success', $message);
    }

    private function validateNotification(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'type' => ['required', 'string', 'max:50', Rule::in($this->notificationTypes())],
            'title' => ['required', 'string', 'max:255'],
            'message' => ['nullable', 'string'],
            'link' => ['nullable', 'string', 'max:255'],
            'recipient' => ['required', Rule::in(['all', 'single'])],
            'user_id' => ['required_if:recipient,single', 'nullable', 'integer', 'exists:users,id'],
            'status' => ['boolean'],
        ]);
    }

    private function notificationTypes(): array
    {
        return ['order', 'promo', 'system', 'payment', 'shipment', 'account'];
    }
}
