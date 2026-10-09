<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Comment>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'description' => fake()->paragraph(),
            'publish_date' => fake()->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
            'user_id' => User::factory(),
            'post_id' => Post::factory(),
            'parent_id' => null,
        ];
    }

    /** Respuesta a otro comentario: hereda el post del padre. */
    public function replyTo(Comment $parent): static
    {
        return $this->state(fn (array $attributes) => [
            'parent_id' => $parent->id,
            'post_id' => $parent->post_id,
        ]);
    }
}
