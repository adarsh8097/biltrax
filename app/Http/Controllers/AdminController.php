<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()?->isSuperAdmin(), 403);

        $admins = User::query()
            ->where('role', User::ROLE_ADMIN)
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->input('status')))
            ->when($request->filled('date_from'), fn ($query) => $query->whereDate('created_at', '>=', $request->input('date_from')))
            ->when($request->filled('date_to'), fn ($query) => $query->whereDate('created_at', '<=', $request->input('date_to')))
            ->orderBy($request->input('sort', 'created_at'), $request->input('direction', 'desc'))
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Index', [
            'admins' => $admins,
            'filters' => $request->only(['search', 'status', 'date_from', 'date_to', 'sort', 'direction']),
        ]);
    }

    public function show(Request $request, User $admin): Response
    {
        abort_unless($request->user()?->isSuperAdmin(), 403);
        abort_if($admin->role !== User::ROLE_ADMIN, 403);

        return Inertia::render('Admin/Show', [
            'admin' => $admin->load('teamMembers'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()?->isSuperAdmin(), 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users')],
            'password' => ['required', 'confirmed', 'min:8'],
            'status' => ['required', Rule::in([User::STATUS_ACTIVE, User::STATUS_SUSPENDED])],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => User::ROLE_ADMIN,
            'status' => $validated['status'],
            'managed_by' => null,
        ]);

        return redirect()->route('admin.index')->with('success', 'Admin created successfully.');
    }

    public function update(Request $request, User $admin): RedirectResponse
    {
        abort_unless($request->user()?->isSuperAdmin(), 403);
        abort_if($admin->role !== User::ROLE_ADMIN, 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($admin->id)],
            'password' => ['nullable', 'confirmed', 'min:8'],
            'status' => ['required', Rule::in([User::STATUS_ACTIVE, User::STATUS_SUSPENDED])],
        ]);

        $admin->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'status' => $validated['status'],
        ]);

        if (! empty($validated['password'])) {
            $admin->password = Hash::make($validated['password']);
        }

        $admin->save();

        return redirect()->route('admin.index')->with('success', 'Admin updated successfully.');
    }

    public function updateStatus(Request $request, User $admin): RedirectResponse
    {
        abort_unless($request->user()?->isSuperAdmin(), 403);
        abort_if($admin->role !== User::ROLE_ADMIN, 403);

        $validated = $request->validate([
            'status' => ['required', Rule::in([User::STATUS_ACTIVE, User::STATUS_SUSPENDED])],
        ]);

        $admin->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'Admin status updated successfully.');
    }

    public function destroy(Request $request, User $admin): RedirectResponse
    {
        abort_unless($request->user()?->isSuperAdmin(), 403);
        abort_if($admin->role !== User::ROLE_ADMIN, 403);

        $admin->delete();

        return redirect()->route('admin.index')->with('success', 'Admin archived successfully.');
    }
}
