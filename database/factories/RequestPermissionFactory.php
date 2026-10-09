<?php

namespace Database\Factories;

use App\Enums\PermissionStatus;
use App\Models\RequestPermission;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Post;
use App\Models\User;

/**
 * @extends Factory<RequestPermission>
 */
class RequestPermissionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'message' => fake()->sentence(12),
            'status' => PermissionStatus::Pending,
            'requested_at' => now(),
            'granted_at' => null,
            'access_expires_at' => null,
            'granted_by' => User::factory()->admin(),
            'user_id' => User::factory()->editor(),
            'post_id' => Post::factory(),
        ];
    }

    /** Aceptada con ventana de 24h abierta (isActive() === true). */
    public function accepted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PermissionStatus::Accepted,
            'granted_at' => now(),
            'access_expires_at' => now()->addHours(24),
        ]);
    }

    public function denied(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PermissionStatus::Denied,
            'granted_at' => now(),
        ]);
    }

    /** Usada dentro de la ventana, que sigue abierta. */
    public function used(): static
    {
        return $this->accepted()->state(fn (array $attributes) => [
            'status' => PermissionStatus::Used,
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PermissionStatus::Expired,
            'requested_at' => now()->subDays(8),
        ]);
    }

    /** Aceptada pero con la ventana ya vencida (isActive() === false). */
    public function windowClosed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PermissionStatus::Accepted,
            'granted_at' => now()->subDays(2),
            'access_expires_at' => now()->subDay(),
        ]);
    }

    /** Pendiente con más de 7 días: la recoge scopeStaleForExpiry(). */
    public function stale(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PermissionStatus::Pending,
            'requested_at' => now()->subDays(8),
        ]);
    }
}
