<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Spatie\MediaLibrary\HasMedia;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Author extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;
    use HasSlug;
    protected $appends = ['profile_url'];

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

    // --- Media ---

    public function getProfileUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('profile') ?: null;
    }


    // --- Relaciones ---

    public function works(): BelongsToMany
    {
        return $this->belongsToMany(Work::class, 'works_authors')->withTimestamps();
    }

    /** Solo para escribir (attach/detach). Para leer usa article(): la relación es 1:1. */
    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(Post::class, 'articles_authors')
            ->using(ArticleAuthor::class)
            ->withTimestamps();
    }

    /** Único artículo del author: unique(author_id) y unique(post_id) en articles_authors. */
    public function article(): HasOneThrough
    {
        return $this->hasOneThrough(Post::class, ArticleAuthor::class, 'author_id', 'id', 'id', 'post_id');
    }

    // --- Accessors ---

    protected function displayName(): Attribute
    {
        return Attribute::get(
            fn() => $this->pseudonym ?: trim("{$this->name} {$this->last_name}")
        );
    }

    // --- Estado ---

    public function hasLiveArticle(): bool
    {
        return $this->article()->exists();
    }

    // --- Scopes ---

    public function scopeWithoutArticle(Builder $query): Builder
    {
        return $query->whereDoesntHave('article');
    }



    public function scopeBirthYear(Builder $query, int $year): Builder
    {
        return $query->where('birth_year', '>=', $year);
    }

    /**
     * Funcion de busqueda
     */
    public function scopeSearch(Builder $query, string $term): Builder
    {
        $tokens = preg_split('/\s+/', trim($term), -1, PREG_SPLIT_NO_EMPTY);

        foreach ($tokens as $token) {
            $like = '%' . addcslashes($token, '%_\\') . '%';

            $query->where(function (Builder $q) use ($like) {
                $q->where('name', 'like', $like)
                    ->orWhere('last_name', 'like', $like)
                    ->orWhere('pseudonym', 'like', $like);
            });
        }

        return $query;
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(fn (Author $author) => $author->display_name)
            ->saveSlugsTo('slug')
            ->doNotGenerateSlugsOnUpdate();
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
