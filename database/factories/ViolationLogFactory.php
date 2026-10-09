<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use App\Models\ViolationLog;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ViolationLog>
 */
class ViolationLogFactory extends Factory
{
    private const ACTIONS = [
        'unauthorized_update',
        'unauthorized_delete',
        'expired_permission_use',
        'rate_limit_exceeded',
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'action' => fake()->randomElement(self::ACTIONS),
            'attempts_count' => fake()->numberBetween(1, 5),
            'post_id' => Post::factory(),
            'user_id' => User::factory()->editor(),
        ];
    }

    /** Violación sin post asociado (post_id es nullable). */
    public function withoutPost(): static
    {
        return $this->state(fn (array $attributes) => [
            'post_id' => null,
        ]);
    }

    /** Registro antiguo, fuera de scopeRecent(24). */
    public function old(int $hours = 48): static
    {
        return $this->state(fn (array $attributes) => [
            'created_at' => now()->subHours($hours),
            'updated_at' => now()->subHours($hours),
        ]);
    }
}
