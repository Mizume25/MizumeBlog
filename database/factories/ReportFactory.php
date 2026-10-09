<?php

namespace Database\Factories;

use App\Enums\ReportStatus;
use App\Models\Post;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Report>
 */
class ReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'message' => fake()->paragraph(),
            'status' => ReportStatus::Pending,
            'resolved_by' => null,
        ];
    }

    public function resolved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReportStatus::Resolved,
            'resolved_by' => User::factory()->admin(),
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReportStatus::Rejected,
            'resolved_by' => User::factory()->admin(),
        ]);
    }

    /** Evita reportes huérfanos: lo vincula a un post (nuevo o dado). */
    public function forPost(?Post $post = null): static
    {
        return $this->afterCreating(function (Report $report) use ($post) {
            $report->posts()->attach($post ?? Post::factory()->create());
        });
    }

    /** Vincula a uno o varios media existentes (ids o modelos). */
    public function forMedia(array $media): static
    {
        return $this->afterCreating(function (Report $report) use ($media) {
            $report->media()->attach(collect($media)->map(fn ($m) => is_object($m) ? $m->id : $m));
        });
    }
}
