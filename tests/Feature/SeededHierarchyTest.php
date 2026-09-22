<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeededHierarchyTest extends TestCase
{
    use RefreshDatabase;

    public function test_seed_creates_one_super_admin_four_admins_and_users_under_each_admin(): void
    {
        $this->seed(DatabaseSeeder::class);

        $superAdmin = User::query()->where('role', User::ROLE_SUPER_ADMIN)->first();
        $admins = User::query()->where('role', User::ROLE_ADMIN)->get();
        $users = User::query()->where('role', User::ROLE_USER)->get();

        $this->assertNotNull($superAdmin);
        $this->assertCount(1, User::query()->where('role', User::ROLE_SUPER_ADMIN)->get());
        $this->assertCount(4, $admins);
        $this->assertTrue($users->isNotEmpty());
        $this->assertSame(4, $admins->filter(fn ($admin) => $admin->managed_by === $superAdmin->id)->count());
        $this->assertSame(4, $users->groupBy('managed_by')->count());
    }
}
