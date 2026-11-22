<?php

namespace Database\Factories;

use App\Enums\EntityStatus;
use App\Enums\WorkCategory;
use App\Enums\WorkMedium;
use App\Models\Work;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
/**
 * @extends Factory<Work>
 */
class WorkFactory extends Factory
{
    private const MEDIUMS_BY_CATEGORY = [
        'literatura' => [WorkMedium::Libro, WorkMedium::Poema, WorkMedium::Novela, WorkMedium::NovelaLigera],
        'animemanga' => [WorkMedium::Anime, WorkMedium::Manga, WorkMedium::Pelicula],
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = rtrim(fake()->sentence(3), '.');
        $category = fake()->randomElement(WorkCategory::cases());

        return [
            'title' => [
                'es' => $title,
                'en' => rtrim(fake('en_US')->sentence(3), '.'),
            ],
            'abbreviation' => strtoupper(Str::of($title)->explode(' ')->map(fn ($w) => Str::substr($w, 0, 1))->implode('')),
            'category' => $category,
            'publish_date' => fake()->date(),
            'sinopsi' => [
                'es' => fake()->paragraphs(2, true),
                'en' => fake('en_US')->paragraphs(2, true),
            ],
            'medium' => fake()->randomElement(self::MEDIUMS_BY_CATEGORY[$category->value]),
        ];
    }

    /** Ficha revisada por un moderador. */
    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => EntityStatus::Verified,
        ]);
    }

    /** Ficha solo con castellano (para probar el fallback "sin traducir"). */
    public function untranslated(): static
    {
        return $this->state(fn (array $attributes) => [
            'title' => ['es' => $attributes['title']['es']],
            'sinopsi' => ['es' => $attributes['sinopsi']['es']],
        ]);
    }

    /** Activada en la home por el admin. */
    public function onHome(int $order = 0): static
    {
        return $this->state(fn (array $attributes) => [
            'home_at' => now(),
            'home_order' => $order,
        ]);
    }

    public function literatura(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => WorkCategory::Literatura,
            'medium' => fake()->randomElement(self::MEDIUMS_BY_CATEGORY['literatura']),
        ]);
    }

    public function animeManga(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => WorkCategory::AnimeManga,
            'medium' => fake()->randomElement(self::MEDIUMS_BY_CATEGORY['animemanga']),
        ]);
    }
}
