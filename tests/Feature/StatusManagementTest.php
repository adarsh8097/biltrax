<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StatusManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_change_admin_and_user_status(): void
    {
        $superAdmin = User::factory()->create([
            'role' => User::ROLE_SUPER_ADMIN,
            'status' => User::STATUS_ACTIVE,
        ]);

        $admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'managed_by' => $superAdmin->id,
            'status' => User::STATUS_ACTIVE,
        ]);

        $user = User::factory()->create([
            'role' => User::ROLE_USER,
            'managed_by' => $admin->id,
            'status' => User::STATUS_ACTIVE,
        ]);

        $this->actingAs($superAdmin)
            ->patch(route('admin.status', $admin->id), ['status' => User::STATUS_SUSPENDED])
            ->assertRedirect();

        $this->assertSame(User::STATUS_SUSPENDED, $admin->fresh()->status);

        $this->actingAs($superAdmin)
            ->patch(route('users.status', $user->id), ['status' => User::STATUS_SUSPENDED])
            ->assertRedirect();

        $this->assertSame(User::STATUS_SUSPENDED, $user->fresh()->status);
    }

    public function test_admin_can_change_only_users_under_their_management(): void
    {
        $superAdmin = User::factory()->create(['role' => User::ROLE_SUPER_ADMIN]);

        $admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'managed_by' => $superAdmin->id,
        ]);

        $managedUser = User::factory()->create([
            'role' => User::ROLE_USER,
            'managed_by' => $admin->id,
            'status' => User::STATUS_ACTIVE,
        ]);

        $otherUser = User::factory()->create([
            'role' => User::ROLE_USER,
            'managed_by' => $superAdmin->id,
            'status' => User::STATUS_ACTIVE,
        ]);

        $this->actingAs($admin)
            ->patch(route('users.status', $managedUser->id), ['status' => User::STATUS_SUSPENDED])
            ->assertRedirect();

        $this->assertSame(User::STATUS_SUSPENDED, $managedUser->fresh()->status);

        $this->actingAs($admin)
            ->patch(route('users.status', $otherUser->id), ['status' => User::STATUS_SUSPENDED]);

        $this->assertNotSame(User::STATUS_SUSPENDED, $otherUser->fresh()->status);
        $this->assertSame(User::STATUS_ACTIVE, $otherUser->fresh()->status);
    }

    public function test_suspended_user_cannot_login(): void
    {
        $user = User::factory()->create([
            'email' => 'suspended@example.com',
            'password' => 'password',
            'role' => User::ROLE_USER,
            'status' => User::STATUS_SUSPENDED,
        ]);

        $response = $this->from('/login')->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertSessionHasErrors('email');
    }
}
