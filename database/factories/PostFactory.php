<?php

namespace Database\Factories;

use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->title(),
            'web_title' => fake()->title(),
            'tags' => fake()->words(3), 
            'category' => 'literatura',
            'author' => fake()->name(),            
            'description' => fake()->paragraphs(),
            'code' => 'TS-' . Str::random(4),
        ];
    }
}
