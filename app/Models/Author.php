<?php

namespace App\Models;

use App\Models\Concerns\HasEntityStatus;
use App\Models\Concerns\HasLocalizedTranslations;
use App\Models\Concerns\Revisionable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

/**
 * Ficha neutra de una persona real: toda propuesta de cambio pasa por revisión humana.
 * El autor real verificado puede reclamarla mediante claims. Cada cambio queda en entity_revisions.
 */
class Author extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;
    use HasSlug;
    use SoftDeletes;
    use HasLocalizedTranslations;
    use HasEntityStatus;
    use Revisionable;

    /** Traducibles: {"es": ..., "en": ...}. El nombre no se traduce. */
    public array $translatable = ['description'];

    protected $appends = ['profile_url'];

    protected $fillable = [
        'name',
        'last_name',
        'pseudonym',
        'birth_year',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'birth_year' => 'integer',
        ];
    }

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

    /** Único artículo del author (posts.author_id es unique). */
    public function article(): HasOne
    {
        return $this->hasOne(Post::class);
    }

    // --- Accessors ---

    protected function displayName(): Attribute
    {
        return Attribute::get(
            fn() => $this->pseudonym ?: trim("{$this->name} {$this->last_name}")
        );
    }

    // --- Estado ---

    /** Tiene artículo vigente (los borrados con soft delete no cuentan). */
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

    /** Busca cada palabra en nombre, apellido o seudónimo. */
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

    /** Posibles duplicados antes de crear una ficha: mismo slug o mismo seudónimo. Incluye las borradas. */
    public function scopePossibleDuplicates(Builder $query, ?string $name, ?string $lastName, ?string $pseudonym): Builder
    {
        $display = $pseudonym ?: trim("{$name} {$lastName}");

        return $query->withTrashed()->where(function (Builder $q) use ($display, $pseudonym) {
            $q->where('slug', Str::slug($display))
                ->when(filled($pseudonym), fn(Builder $p) => $p->orWhere('pseudonym', $pseudonym));
        });
    }

    // --- Slug ---

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(fn(Author $author) => $author->display_name)
            ->saveSlugsTo('slug')
            ->doNotGenerateSlugsOnUpdate();
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
