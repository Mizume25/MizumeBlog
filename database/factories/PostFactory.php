<?php

namespace Database\Factories;

use App\Enums\PostType;
use App\Enums\UserRole;
use App\Models\Author;
use App\Models\Post;
use App\Models\User;
use App\Models\Work;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * Por defecto: artículo de un work (work_id). Un usuario solo puede tener un post por work
 * (unique user_id + work_id): al crear varios para el mismo usuario, pasa work_id explícito.
 *
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    public function definition(): array
    {
        $title = rtrim(fake()->sentence(4), '.');

        return [
            'title' => [
                'es' => $title,
                'en' => rtrim(fake('en_US')->sentence(4), '.'),
            ],
            'description' => [
                'es' => fake()->paragraph(),
                'en' => fake('en_US')->paragraph(),
            ],
            'publish_date' => fake()->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'code' => strtoupper(Str::substr(Str::slug($title, ''), 0, 2) . '-' . Str::random(4))
                . fake()->unique()->numerify('##'),
            'type' => PostType::Article,
            'user_id' => fn() => User::where('role', UserRole::Editor)->inRandomOrder()->value('id')
                ?? User::factory()->editor(),
            'work_id' => Work::factory(),
            'author_id' => null,
        ];
    }

    /** Artículo de un author (author_id; nunca a la vez que work_id). */
    public function forAuthor(?Author $author = null): static
    {
        return $this->state(fn(array $attributes) => [
            'type' => PostType::Article,
            'work_id' => null,
            'author_id' => $author?->id ?? Author::factory(),
        ]);
    }

    /** Artículo de un work concreto. */
    public function forWork(Work $work): static
    {
        return $this->state(fn(array $attributes) => [
            'type' => PostType::Article,
            'work_id' => $work->id,
            'author_id' => null,
        ]);
    }

    /** Contenido del sitio: no apunta a work ni author. */
    public function policy(): static
    {
        return $this->state(fn(array $attributes) => [
            'type' => PostType::Policy,
            'work_id' => null,
            'author_id' => null,
        ]);
    }

    /** Destacado por su propio autor (consume su cupo). Solo tiene efecto si está publicado. */
    public function featured(): static
    {
        return $this->state(fn(array $attributes) => [
            'featured_at' => now(),
            'featured_by' => $attributes['user_id'],
        ]);
    }

    /** Borrador: sin fecha de publicación. */
    public function draft(): static
    {
        return $this->state(fn(array $attributes) => [
            'publish_date' => null,
        ]);
    }

    public function ownedBy(User $user): static
    {
        return $this->state(fn(array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}
