<?php

namespace Database\Factories;

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
            'title' => $title,
            'abbreviation' => strtoupper(Str::of($title)->explode(' ')->map(fn ($w) => Str::substr($w, 0, 1))->implode('')),
            'category' => $category,
            'publish_date' => fake()->date(),
            'sinopsi' => fake()->paragraphs(2, true),
            'medium' => fake()->randomElement(self::MEDIUMS_BY_CATEGORY[$category->value]),
        ];
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
