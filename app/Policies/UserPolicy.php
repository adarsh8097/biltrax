<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function before(User $authUser): ?bool
    {
        if ($authUser->isSuperAdmin()) {
            return true;
        }

        return null;
    }

    public function viewAny(User $authUser): bool
    {
        return true;
    }

    public function view(User $authUser, User $targetUser): bool
    {
        if ($authUser->id === $targetUser->id) {
            return true;
        }

        if ($authUser->isAdmin() && $targetUser->role === User::ROLE_USER && $targetUser->managed_by === $authUser->id) {
            return true;
        }

        if ($authUser->isUser() && $targetUser->role === User::ROLE_USER && $targetUser->managed_by === $authUser->managed_by) {
            return true;
        }

        return false;
    }

    public function create(User $authUser): bool
    {
        return $authUser->isAdmin() || $authUser->isSuperAdmin();
    }

    public function update(User $authUser, User $targetUser): bool
    {
        if ($authUser->id === $targetUser->id) {
            return true;
        }

        if ($authUser->isAdmin() && $targetUser->role === User::ROLE_USER && $targetUser->managed_by === $authUser->id) {
            return true;
        }

        return false;
    }

    public function updateStatus(User $authUser, User $targetUser): bool
    {
        if ($authUser->isSuperAdmin()) {
            return true;
        }

        return $authUser->isAdmin()
            && $targetUser->role === User::ROLE_USER
            && $targetUser->managed_by === $authUser->id;
    }

    public function delete(User $authUser, User $targetUser): bool
    {
        return $this->update($authUser, $targetUser);
    }

    public function restore(User $authUser, User $targetUser): bool
    {
        return $this->update($authUser, $targetUser);
    }

    public function forceDelete(User $authUser, User $targetUser): bool
    {
        return $this->update($authUser, $targetUser);
    }
}
