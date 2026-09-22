<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $superAdmin = User::query()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_SUPER_ADMIN,
            'status' => User::STATUS_ACTIVE,
            'managed_by' => null,
        ]);

        $admins = [
            ['name' => 'Admin One', 'email' => 'admin1@example.com'],
            ['name' => 'Admin Two', 'email' => 'admin2@example.com'],
            ['name' => 'Admin Three', 'email' => 'admin3@example.com'],
            ['name' => 'Admin Four', 'email' => 'admin4@example.com'],
        ];

        foreach ($admins as $adminData) {
            User::query()->create([
                'name' => $adminData['name'],
                'email' => $adminData['email'],
                'password' => Hash::make('password'),
                'role' => User::ROLE_ADMIN,
                'status' => User::STATUS_ACTIVE,
                'managed_by' => $superAdmin->id,
            ]);
        }

        $adminUsers = User::query()->where('role', User::ROLE_ADMIN)
            ->where('managed_by', $superAdmin->id)
            ->get();

        foreach ($adminUsers as $admin) {
            User::factory()->count(2)->create([
                'role' => User::ROLE_USER,
                'status' => User::STATUS_ACTIVE,
                'managed_by' => $admin->id,
            ]);
        }
    }
}
