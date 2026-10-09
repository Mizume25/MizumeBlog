<?php

namespace Database\Factories;

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
            'birth_year' => fake()->year(),
            'description' => fake()->text(200),
        ];
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
