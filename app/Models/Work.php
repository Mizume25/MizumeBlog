<?php

namespace App\Models;

use App\Enums\WorkCategory;
use App\Enums\WorkMedium;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\MediaLibrary\InteractsWithMedia;

class Work extends Model
{   
    use HasFactory;
    use InteractsWithMedia;

    protected $fillable = [
        'title',
        'abbreviation',
        'category',
        'publish_date',
        'sinopsi',
        'medium',
    ];

    protected function casts(): array
    {
        return [
            'category' => WorkCategory::class,
            'medium' => WorkMedium::class,
            'publish_date' => 'date',
        ];
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('cover')->singleFile();
    }

    

    // --- Relaciones ---

    public function authors(): BelongsToMany
    {
        return $this->belongsToMany(Author::class, 'works_authors')->withTimestamps();
    }

    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class, 'articles_works')->withTimestamps();
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'works_tags')->withTimestamps();
    }

    // --- Scopes ---

    public function scopeOfCategory(Builder $query, WorkCategory $category): Builder
    {
        return $query->where('category', $category);
    }

    public function scopeOfMedium(Builder $query, WorkMedium $medium): Builder
    {
        return $query->where('medium', $medium);
    }

    public function scopeWithTag(Builder $query, string $tagName): Builder
    {
        return $query->whereHas('tags', fn (Builder $q) => $q->where('name', $tagName));
    }

    // --- Tags ---


    public function syncTagsByName(array $names): void
    {
        $ids = collect($names)
            ->map(fn (string $name) => Tag::findOrCreateNormalized($name)->id);

        $this->tags()->sync($ids);
    }
}
