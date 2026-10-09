<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Comment>
 */
class CommentFactory extends Factory
{


    private function query(): Post
    {
        return Post::whereHas('user', function ($query) {
            $query->where('role', UserRole::Editor)
                ->orWhere('role', UserRole::Admin);
        })->first();
    }
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {   
        $post = $this->query();
        return [
            'description' => fake()->paragraph(),
            'publish_date' => fake()->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
            'user_id' => $post?->user_id,
            'post_id' => $post?->id,
            'parent_id' => null,
        ];
    }

    /** Respuesta a otro comentario: hereda el post del padre. */
    public function replyTo(Comment $parent): static
    {
        return $this->state(fn(array $attributes) => [
            'parent_id' => $parent->id,
            'post_id' => $parent->post_id,
        ]);
    }
}
