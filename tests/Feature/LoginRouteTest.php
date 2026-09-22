<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginRouteTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_page_is_available_at_login_route(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }
}
