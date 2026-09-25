<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        if ($user->isSuperAdmin()) {
            $query = User::query()->where('role', User::ROLE_USER);
        } elseif ($user->isAdmin()) {
            $query = User::query()->where('role', User::ROLE_USER)->where('managed_by', $user->id);
        } else {
            abort(403);
        }

        $query->when($request->filled('search'), function ($query) use ($request) {
            $search = $request->input('search');
            $query->where(function ($item) use ($search) {
                $item->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        })
            ->when($request->filled('role'), fn ($query) => $query->where('role', $request->input('role')))
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->input('status')))
            ->when($request->filled('date_from'), fn ($query) => $query->whereDate('created_at', '>=', $request->input('date_from')))
            ->when($request->filled('date_to'), fn ($query) => $query->whereDate('created_at', '<=', $request->input('date_to')))
            ->orderBy($request->input('sort', 'created_at'), $request->input('direction', 'desc'));

        $users = $query->paginate(10)->withQueryString();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'status', 'role', 'date_from', 'date_to', 'sort', 'direction']),
            'isSuperAdmin' => $user->isSuperAdmin(),
            'isAdmin' => $user->isAdmin(),
        ]);
    }

    public function show(Request $request, User $user): Response
    {
        $this->authorize('view', $user);

        return Inertia::render('Users/Show', [
            'user' => $user->load('manager'),
        ]);
    }

    public function peers(Request $request): Response
    {
        abort_unless($request->user()?->isUser(), 403);

        $peers = User::query()
            ->where('role', User::ROLE_USER)
            ->where('managed_by', $request->user()->managed_by)
            ->whereKeyNot($request->user()->id)
            ->paginate(10);

        return Inertia::render('Users/Peers', [
            'users' => $peers,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()?->isSuperAdmin() || $request->user()?->isAdmin(), 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users')],
            'password' => ['required', 'confirmed', 'min:8'],
            'role' => ['required', Rule::in([User::ROLE_USER, User::ROLE_ADMIN])],
            'status' => ['required', Rule::in([User::STATUS_ACTIVE, User::STATUS_SUSPENDED])],
            'managed_by' => ['nullable', 'exists:users,id'],
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        if ($request->user()->isAdmin() && ($validated['role'] !== User::ROLE_USER || $validated['managed_by'] !== $request->user()->id)) {
            abort(403);
        }

        $managedBy = $validated['managed_by'] ?? ($request->user()->isAdmin() ? $request->user()->id : null);

        $avatarPath = $request->hasFile('avatar')
            ? $request->file('avatar')->store('avatars', 'public')
            : null;

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'status' => $validated['status'],
            'managed_by' => $managedBy,
            'avatar' => $avatarPath,
        ]);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', 'confirmed', 'min:8'],
            'status' => ['required', Rule::in([User::STATUS_ACTIVE, User::STATUS_SUSPENDED])],
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        if ($request->hasFile('avatar')) {
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            $user->avatar = $request->file('avatar')->store('avatars', 'public');
        }

        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'status' => $validated['status'],
        ]);

        if (! empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function updateStatus(Request $request, User $user): RedirectResponse
    {
        $this->authorize('updateStatus', $user);

        $validated = $request->validate([
            'status' => ['required', Rule::in([User::STATUS_ACTIVE, User::STATUS_SUSPENDED])],
        ]);

        $user->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'User status updated successfully.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        $this->authorize('delete', $user);

        $user->delete();

        return redirect()->route('users.index')->with('success', 'User archived successfully.');
    }

    public function trash(Request $request): Response
    {
        abort_unless($request->user()?->isSuperAdmin() || $request->user()?->isAdmin(), 403);

        $query = User::onlyTrashed();

        if ($request->user()->isAdmin()) {
            $query->where('managed_by', $request->user()->id);
        }

        return Inertia::render('Users/Trash', [
            'users' => $query->paginate(10),
        ]);
    }

    public function restore(Request $request, int $id): RedirectResponse
    {
        abort_unless($request->user()?->isSuperAdmin() || $request->user()?->isAdmin(), 403);

        $user = User::onlyTrashed()->findOrFail($id);
        $this->authorize('restore', $user);
        $user->restore();

        return back()->with('success', 'User restored successfully.');
    }

    public function forceDelete(Request $request, int $id): RedirectResponse
    {
        abort_unless($request->user()?->isSuperAdmin() || $request->user()?->isAdmin(), 403);

        $user = User::onlyTrashed()->findOrFail($id);
        $this->authorize('forceDelete', $user);
        $user->forceDelete();

        return back()->with('success', 'User permanently deleted.');
    }
}
