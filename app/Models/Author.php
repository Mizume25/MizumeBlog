<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Author extends Model
{   
    use HasFactory;
    use InteractsWithMedia;

    protected $fillable = [
        'name',
        'last_name',
        'pseudonym',
        'birth_year',
        'description'
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('profile')->singleFile();
    }

    // --- Relaciones ---

    public function works(): BelongsToMany
    {
        return $this->belongsToMany(Work::class, 'works_authors')->withTimestamps();
    }

    /** unique(author_id) en la pivote: nunca hay más de un artículo vivo. */
    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(Post::class, 'articles_authors')->withTimestamps();
    }

    // --- Accessors ---

    protected function displayName(): Attribute
    {
        return Attribute::get(
            fn () => $this->pseudonym ?: trim("{$this->name} {$this->last_name}")
        );
    }

    // --- Estado ---

    public function hasLiveArticle(): bool
    {
        return $this->articles()->exists();
    }

    // --- Scopes ---

    public function scopeWithoutArticle(Builder $query): Builder
    {
        return $query->whereDoesntHave('articles');
    }
}
