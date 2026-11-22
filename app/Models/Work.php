<?php

namespace App\Models;

use App\Enums\WorkCategory;
use App\Enums\WorkMedium;
use App\Models\Concerns\HasEntityStatus;
use App\Models\Concerns\HasLocalizedTranslations;
use App\Models\Concerns\Revisionable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

/**
 * Ficha neutra de una obra: de la comunidad, nadie es su dueño.
 * Escribir posts sobre ella no da poder sobre la ficha. Cada cambio queda en entity_revisions.
 */
class Work extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;
    use HasSlug;
    use SoftDeletes;
    use HasLocalizedTranslations;
    use HasEntityStatus;
    use Revisionable;

    /** Traducibles: {"es": ..., "en": ...}. category y medium se traducen en lang/, no aquí. */
    public array $translatable = ['title', 'sinopsi'];

    protected $appends = ['cover_url'];

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
            'category'     => WorkCategory::class,
            'medium'       => WorkMedium::class,
            'publish_date' => 'date',
            'home_at'      => 'datetime',
            'home_order'   => 'integer',
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

    /** Posts sobre esta obra (posts.work_id). Un usuario tiene como máximo uno. */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
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

    public function scopeWithTag(Builder $query, int $tagId): Builder
    {
        return $query->whereHas('tags', fn(Builder $q) => $q->where('tags.id', $tagId));
    }

    /** Obras con al menos un post destacado y publicado. */
    public function scopeWithFeaturedPost(Builder $query): Builder
    {
        return $query->whereHas('posts', fn(Builder $q) => $q->featured()->publishPosts());
    }

    /** Búsqueda por título (cualquier idioma) o abreviatura; ignora mayúsculas y tildes. */
    public function scopeSearch(Builder $query, string $term): Builder
    {
        $like = '%' . addcslashes($term, '%_\\') . '%';

        return $query->where(function (Builder $q) use ($term, $like) {
            $q->whereTranslationLike('title', $term)
                ->orWhere('abbreviation', 'like', $like);
        });
    }

    /**
     * Posibles duplicados antes de crear una ficha ("¿te refieres a…?"):
     * mismo slug, misma abreviatura o mismo título en cualquier idioma. Incluye las borradas.
     */
    public function scopePossibleDuplicates(Builder $query, string $title, ?string $abbreviation = null): Builder
    {
        $slug = (new static)->slugFor($title);

        return $query->withTrashed()->where(function (Builder $q) use ($title, $slug, $abbreviation) {
            $q->where('slug', $slug)
                ->orWhere(fn(Builder $t) => $t->whereTranslationIs('title', $title))
                ->when(filled($abbreviation), fn(Builder $a) => $a->orWhere('abbreviation', $abbreviation));
        });
    }

    /** Obras activadas por el admin para la home, en su orden. */
    public function scopeOnHome(Builder $query): Builder
    {
        return $query->whereNotNull('home_at')->orderBy('home_order')->orderBy('home_at');
    }

    // --- Home (curación del admin) ---

    public function isOnHome(): bool
    {
        return $this->home_at !== null;
    }

    public function showOnHome(?int $order = null): bool
    {
        return $this->forceFill([
            'home_at'    => $this->home_at ?? now(),
            'home_order' => $order ?? $this->home_order,
        ])->save();
    }

    public function hideFromHome(): bool
    {
        return $this->forceFill(['home_at' => null, 'home_order' => null])->save();
    }

    // --- Tags ---

    /** Sincroniza tags por nombre (crea las que falten) y registra el cambio en el historial. */
    public function syncTagsByName(array $names): void
    {
        $ids = collect($names)
            ->map(fn(string $name) => Tag::findOrCreateNormalized($name)->id)
            ->all();

        $old = $this->tags()->pluck('tags.id')->all();

        $this->tags()->sync($ids);

        $this->recordRelationChange('tags', $old, $ids);
    }

    // --- Media ---

    public function getCoverUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('cover') ?: null;
    }

    // --- Slug ---

    /** Siempre desde el título en castellano: la URL no cambia con el idioma. */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(fn(Work $work) => $work->baseTranslation('title'))
            ->saveSlugsTo('slug')
            ->doNotGenerateSlugsOnUpdate();
    }

    /** Slug que tendría un título (sin sufijo de unicidad). */
    public function slugFor(string $title): string
    {
        return Str::slug($title);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
