<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request): View
    {
        $query = ActivityLog::with('causer')->latest();

        if ($request->filled('action')) {
            $query->where('action', $request->query('action'));
        }

        if ($request->filled('subject_type')) {
            $query->where('subject_type', $request->query('subject_type'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where('description', 'like', "%{$search}%");
        }

        $logs = $query->paginate(25)->appends($request->query());

        $actions = ActivityLog::select('action')->distinct()->pluck('action')->sort()->values();
        $subjectTypes = ActivityLog::select('subject_type')->distinct()->pluck('subject_type')->sort()->values();

        return view('admin.audit-logs.index', [
            'logs' => $logs,
            'actions' => $actions,
            'subjectTypes' => $subjectTypes,
            'action' => $request->query('action'),
            'subject_type' => $request->query('subject_type'),
            'search' => $request->query('search'),
        ]);
    }
}
