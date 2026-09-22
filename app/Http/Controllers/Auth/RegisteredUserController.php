<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register', [
            'admins' => User::query()->where('role', User::ROLE_ADMIN)->select('id', 'name', 'email')->get(),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'admin_id' => ['nullable', 'exists:users,id'],
        ]);

        $adminId = $request->input('admin_id');

        if (! $adminId) {
            $adminId = User::query()->where('role', User::ROLE_ADMIN)->value('id');
        }

        if (! $adminId) {
            return back()->withErrors(['admin_id' => 'Please select a valid admin to assign this user.']);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => User::ROLE_USER,
            'status' => User::STATUS_ACTIVE,
            'managed_by' => $adminId,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->intended(route('peers.index', absolute: false));
    }
}
