<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $stats = [
            'admins' => User::withTrashed()->where('role', User::ROLE_ADMIN)->count(),
            'users' => User::withTrashed()->where('role', User::ROLE_USER)->count(),
            'active_users' => User::where('role', User::ROLE_USER)->where('status', User::STATUS_ACTIVE)->count(),
        ];

        if ($user->isAdmin()) {
            $stats['team_users'] = User::where('managed_by', $user->id)->where('role', User::ROLE_USER)->count();
            $stats['team_active_users'] = User::where('managed_by', $user->id)->where('role', User::ROLE_USER)->where('status', User::STATUS_ACTIVE)->count();
        }

        if ($user->isUser()) {
            $stats['peers'] = User::where('managed_by', $user->managed_by)->where('role', User::ROLE_USER)->count();
        }

        return Inertia::render('Dashboard', [
            'user' => $user,
            'stats' => $stats,
        ]);
    }
}
