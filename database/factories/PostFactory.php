<?php

namespace Database\Factories;

use App\Enums\ArticleType;
use App\Enums\PostType;
use App\Enums\UserRole;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->sentence(4);

        return [
            'title' => rtrim($title, '.'),
            'publish_date' => fake()->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'description' => fake()->paragraph(),
            'featured' => fake()->boolean(20),
            'code' => strtoupper(Str::substr(Str::slug($title, ''), 0, 2) . '-' . Str::random(4))
                . fake()->unique()->numerify('##'),
            'type' => PostType::Article,
            'article_type' => ArticleType::Work,
            'user_id' => User::where('role', UserRole::Editor)->inRandomOrder()->value('id')
        ];
    }

    /** Artículo de un author (va en articles_authors, nunca en articles_works). */
    public function forAuthor(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => PostType::Article,
            'article_type' => ArticleType::Author,
        ]);
    }

    public function policy(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => PostType::Policy,
            'article_type' => null,
            'featured' => false,
        ]);
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'featured' => true,
        ]);
    }

    /** Borrador: sin fecha de publicación. */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'publish_date' => null,
        ]);
    }

    public function ownedBy(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}
