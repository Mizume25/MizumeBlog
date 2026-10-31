<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Spatie\MediaLibrary\HasMedia;

class Author extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

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

    /** unique(author_id) en la pivote: nunca hay más de un artículo vivo. */
    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(Post::class, 'articles_authors')->withTimestamps();
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
        return $this->articles()->exists();
    }

    // --- Scopes ---

    public function scopeWithoutArticle(Builder $query): Builder
    {
        return $query->whereDoesntHave('articles');
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
}
