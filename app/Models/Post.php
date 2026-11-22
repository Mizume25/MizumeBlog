<?php

namespace App\Models;

use App\Enums\ArticleType;
use App\Enums\PostFilterType;
use App\Enums\PostType;
use App\Models\Concerns\HasLocalizedTranslations;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

/**
 * Aportación de un usuario: solo su autor la edita.
 *
 * Un article pertenece a UN work (work_id) o a UN author (author_id), nunca a ambos (CHECK en BD).
 * - unique(user_id, work_id): un usuario escribe un solo post por work.
 * - unique(author_id): un author tiene un único artículo.
 * article_type no es columna: se deduce de qué FK está rellena.
 */
class Post extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;
    use SoftDeletes;
    use HasLocalizedTranslations;

    private const CONTENT_DISK = 'local';
    private const DEFAULT_LOCALE = 'es';
    private const SUPPORTED_LOCALES = ['es', 'en'];

    /** Traducibles: {"es": ..., "en": ...}. El contenido va en .md por idioma (contentPath). */
    public array $translatable = ['title', 'description'];

    protected $appends = ['article_type'];

    /** featured_at / featured_by no son asignables: se cambian con feature() / unfeature(). */
    protected $fillable = [
        'title',
        'publish_date',
        'description',
        'code',
        'type',
        'user_id',
        'work_id',
        'author_id',
    ];

    protected function casts(): array
    {
        return [
            'type'        => PostType::class,
            'user_id'     => 'integer',
            'work_id'     => 'integer',
            'author_id'   => 'integer',
            'featured_at' => 'datetime',
        ];
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('gallery');
    }

    // --- Relaciones ---

    /** Usuario al que pertenece */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** Work del artículo (solo article_type = work). */
    public function work(): BelongsTo
    {
        return $this->belongsTo(Work::class);
    }

    /** Author del artículo (solo article_type = author). */
    public function author(): BelongsTo
    {
        return $this->belongsTo(Author::class);
    }

    /** Quién lo destacó (el propio autor consume cupo; un admin no). */
    public function featuredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'featured_by');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function permissionRequests(): HasMany
    {
        return $this->hasMany(RequestPermission::class);
    }

    public function reports(): BelongsToMany
    {
        return $this->belongsToMany(Report::class, 'reports_post');
    }

    public function violationLogs(): HasMany
    {
        return $this->hasMany(ViolationLog::class);
    }

    // --- Accessors ---

    /** work | author | null, según qué FK esté rellena. */
    protected function articleType(): Attribute
    {
        return Attribute::get(fn() => match (true) {
            $this->work_id !== null   => ArticleType::Work,
            $this->author_id !== null => ArticleType::Author,
            default                   => null,
        });
    }

    // --- Scopes ---

    public function scopeOfType(Builder $query, PostType $type): Builder
    {
        return $query->where('type', $type);
    }

    public function scopeArticles(Builder $query): Builder
    {
        return $query->ofType(PostType::Article);
    }

    public function scopeOfArticleType(Builder $query, ArticleType $type): Builder
    {
        return $query->articles()->whereNotNull(match ($type) {
            ArticleType::Work   => 'work_id',
            ArticleType::Author => 'author_id',
        });
    }

    public function scopePolicies(Builder $query): Builder
    {
        return $query->ofType(PostType::Policy);
    }

    public function scopeOwnedBy(Builder $query, User $user): Builder
    {
        return $query->where('user_id', $user->id);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->whereNotNull('featured_at');
    }

    /** Destacados puestos por el propio autor: son los que consumen su cupo. */
    public function scopeFeaturedByOwner(Builder $query): Builder
    {
        return $query->featured()->whereColumn('featured_by', 'user_id');
    }

    public function scopePublishPosts(Builder $query): Builder
    {
        return $query
            ->whereNotNull('publish_date')
            ->where('publish_date', '<=', now());
    }

    /** Búsqueda parcial por título en cualquier idioma (ignora mayúsculas y tildes). */
    public function scopeSearchTitle(Builder $query, string $term): Builder
    {
        return $query->whereTranslationLike('title', $term);
    }

    /** Filtra por estado de publicación: publicados, programados (pending), borradores o todos */
    public function scopePostStatus(Builder $query, PostFilterType $type): Builder
    {
        $today = now()->toDateString();

        return match ($type) {
            PostFilterType::Publish  => $query->whereNotNull('publish_date')->whereDate('publish_date', '<=', $today),
            PostFilterType::Pendings => $query->whereDate('publish_date', '>', $today),
            PostFilterType::Drafts   => $query->whereNull('publish_date'),
            PostFilterType::All      => $query,
        };
    }

    // --- Estado ---

    public function isOwnedBy(User $user): bool
    {
        return $this->user_id === $user->id;
    }

    public function isPublished(): bool
    {
        return $this->publish_date !== null && $this->publish_date <= now()->toDateString();
    }

    public function isFeatured(): bool
    {
        return $this->featured_at !== null;
    }

    /** true si el destacado lo puso el propio autor (consume su cupo). */
    public function isFeaturedByOwner(): bool
    {
        return $this->isFeatured() && $this->featured_by === $this->user_id;
    }

    public function activePermissionFor(User $user): ?RequestPermission
    {
        return $this->permissionRequests()
            ->where('user_id', $user->id)
            ->activeWindow()
            ->latest('access_expires_at')
            ->first();
    }

    // --- Destacados ---

    /**
     * Marca el post como destacado. Las reglas (publicado, cupo con lockForUpdate, permisos)
     * se comprueban antes, en la policy y en el servicio de destacados.
     */
    public function feature(User $by): bool
    {
        return $this->forceFill(['featured_at' => now(), 'featured_by' => $by->id])->save();
    }

    public function unfeature(): bool
    {
        return $this->forceFill(['featured_at' => null, 'featured_by' => null])->save();
    }

    // --- Contenido ---

    public function contentPath(string $locale): ?string
    {
        $disk = Storage::disk(self::CONTENT_DISK);

        $candidates = in_array($locale, self::SUPPORTED_LOCALES, true)
            ? [$locale, self::DEFAULT_LOCALE]
            : [self::DEFAULT_LOCALE];

        foreach (array_unique($candidates) as $candidate) {
            $path = $this->contentDirectory() . "/content_{$candidate}.md";

            if ($disk->exists($path)) {
                return $path;
            }
        }

        return null;
    }

    protected function contentDirectory(): string
    {
        return 'posts/' . $this->getKey();
    }

    // --- Consultas ---

    /** Destacados publicados de works, con su work, agrupados por usuario (home). */
    public static function featuredGroupedByUser(): Collection
    {
        return static::ofArticleType(ArticleType::Work)
            ->featured()
            ->publishPosts()
            ->with(['work.media', 'work.tags', 'work.authors', 'user'])
            ->latest('featured_at')
            ->get()
            ->groupBy('user_id');
    }

    // --- Caché ---

    /**
     * Clave de la caché de posts legality (prop compartida `terms`).
     * Lleva el idioma: lo cacheado son títulos YA traducidos (toArray), uno por idioma.
     */
    public static function legalityCacheKey(?string $locale = null): string
    {
        return 'legality_posts.' . ($locale ?? app()->getLocale());
    }

    public static function forgetLegalityCache(): void
    {
        foreach (config('app.available_locales') as $locale) {
            Cache::forget(static::legalityCacheKey($locale));
        }
    }

    protected static function booted(): void
    {
        static::saved(fn() => static::forgetLegalityCache());
        static::deleted(fn() => static::forgetLegalityCache());

        // Solo se destacan posts publicados: al pasar a borrador o programado pierde el destacado.
        static::saving(function (Post $post) {
            if ($post->isFeatured() && ! $post->isPublished()) {
                $post->featured_at = null;
                $post->featured_by = null;
            }
        });

        // Un post eliminado pierde su destacado (el soft delete solo escribe deleted_at).
        static::deleted(function (Post $post) {
            if ($post->isFeatured()) {
                static::withTrashed()->whereKey($post->getKey())->update(['featured_at' => null, 'featured_by' => null]);
            }
        });
    }
}
