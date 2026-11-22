<?php

namespace Database\Factories;

use App\Enums\EntityStatus;
use App\Models\Author;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Author>
 */
class AuthorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'pseudonym' => null,
            'birth_year' => (int) fake()->year(),
            'description' => [
                'es' => fake()->text(200),
                'en' => fake('en_US')->text(200),
            ],
        ];
    }

    /** Ficha revisada por un moderador. */
    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => EntityStatus::Verified,
        ]);
    }

    /** Autor conocido solo por seudónimo (displayName devuelve el seudónimo). */
    public function pseudonymous(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => null,
            'last_name' => null,
            'pseudonym' => fake()->unique()->userName(),
        ]);
    }
}
