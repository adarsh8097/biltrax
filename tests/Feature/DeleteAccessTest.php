<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeleteAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_delete_admin_and_user(): void
    {
        $superAdmin = User::factory()->create(['role' => User::ROLE_SUPER_ADMIN]);

        $admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'managed_by' => $superAdmin->id,
        ]);

        $user = User::factory()->create([
            'role' => User::ROLE_USER,
            'managed_by' => $admin->id,
        ]);

        $this->actingAs($superAdmin)
            ->delete(route('admin.destroy', $admin->id))
            ->assertRedirect();

        $this->assertSoftDeleted($admin);

        $this->actingAs($superAdmin)
            ->delete(route('users.destroy', $user->id))
            ->assertRedirect();

        $this->assertSoftDeleted($user);
    }
}
