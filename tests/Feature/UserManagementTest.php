<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function makeUser(array $overrides = []): User
    {
        return User::factory()->create(array_merge([
            'role' => 'user',
            'status' => 'active',
            'managed_by' => null,
        ], $overrides));
    }

    public function test_super_admin_can_list_admins_and_users(): void
    {
        $super = User::factory()->create([
            'role' => 'super_admin',
            'status' => 'active',
        ]);

        $admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);

        $user = User::factory()->create([
            'role' => 'user',
            'status' => 'active',
            'managed_by' => $admin->id,
        ]);

        $this->actingAs($super)
            ->get(route('admin.index'))
            ->assertOk();

        $this->actingAs($super)
            ->get(route('users.index'))
            ->assertOk();
    }

    public function test_admin_cannot_access_admin_management_routes(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);

        $this->actingAs($admin)
            ->get(route('admin.index'))
            ->assertStatus(403);
    }

    public function test_admin_cannot_view_other_admins_or_other_admin_users(): void
    {
        $adminA = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $adminB = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $userA = $this->makeUser(['managed_by' => $adminA->id]);
        $userB = $this->makeUser(['managed_by' => $adminB->id]);

        $this->actingAs($adminA)
            ->get(route('users.show', $userB))
            ->assertStatus(403);

        $this->actingAs($adminA)
            ->get(route('admin.show', $adminB))
            ->assertStatus(403);
    }

    public function test_user_can_view_same_admin_peers_only(): void
    {
        $adminA = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $adminB = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $userA1 = $this->makeUser(['managed_by' => $adminA->id]);
        $userA2 = $this->makeUser(['managed_by' => $adminA->id]);
        $userB = $this->makeUser(['managed_by' => $adminB->id]);

        $this->actingAs($userA1)
            ->get(route('peers.index'))
            ->assertOk()
            ->assertSee($userA2->name)
            ->assertDontSee($userB->name);
    }

    public function test_user_cannot_access_admin_routes(): void
    {
        $user = $this->makeUser();

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk();

        $this->actingAs($user)
            ->get(route('admin.index'))
            ->assertStatus(403);
    }

    public function test_user_can_delete_their_own_profile_and_is_logged_out(): void
    {
        $user = $this->makeUser();

        $this->actingAs($user)
            ->delete(route('profile.self-delete'), ['password' => 'password'])
            ->assertRedirect(route('login'))
            ->assertSessionHas('status');

        $this->assertSoftDeleted('users', ['id' => $user->id]);
    }

    public function test_admin_and_super_admin_cannot_self_delete(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $superAdmin = User::factory()->create(['role' => 'super_admin', 'status' => 'active']);

        $this->actingAs($admin)
            ->delete(route('profile.self-delete'), ['password' => 'password'])
            ->assertStatus(403);

        $this->actingAs($superAdmin)
            ->delete(route('profile.self-delete'), ['password' => 'password'])
            ->assertStatus(403);
    }

    public function test_user_cannot_delete_another_user_profile(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $userOwner = $this->makeUser(['managed_by' => $admin->id]);
        $otherUser = $this->makeUser(['managed_by' => $admin->id]);

        $this->actingAs($userOwner)
            ->delete(route('users.destroy', $otherUser))
            ->assertStatus(403);
    }

    public function test_duplicate_email_is_rejected_on_user_create(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $existing = $this->makeUser(['email' => 'existing@example.com']);

        $this->actingAs($admin)
            ->post(route('users.store'), [
                'name' => 'New User',
                'email' => 'existing@example.com',
                'password' => 'Password123!',
                'role' => 'user',
                'status' => 'active',
                'managed_by' => $admin->id,
            ])
            ->assertSessionHasErrors(['email']);
    }
}
