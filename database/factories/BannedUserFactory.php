<?php

namespace Database\Factories;

use App\Models\BannedUser;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
/**
 * @extends Factory<BannedUser>
 */
class BannedUserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'email' => fake()->unique()->safeEmail(),
            'ip_address' => fake()->ipv4(),
            'reason' => fake()->sentence(10),
            'banned_by' => User::factory()->admin(),
        ];
    }

    /** Banea el email (e IP opcional) de un usuario existente. */
    public function forUser(User $user, ?string $ip = null): static
    {
        return $this->state(fn (array $attributes) => [
            'email' => $user->email,
            'ip_address' => $ip ?? $attributes['ip_address'],
        ]);
    }

    public function ipv6(): static
    {
        return $this->state(fn (array $attributes) => [
            'ip_address' => fake()->ipv6(),
        ]);
    }
}
