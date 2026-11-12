<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Enums\ArticleType;
use App\Enums\PostType;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;
use App\Models\PostImage;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Spatie\Sluggable\HasSlug;


class Post extends Model implements HasMedia
{

    use HasFactory;
    use InteractsWithMedia;
    private const CONTENT_DISK = 'local';
    private const DEFAULT_LOCALE = 'es';
    private const SUPPORTED_LOCALES = ['es', 'en'];

    //Propiedades de Modelo
    protected $fillable = [
        'title',
        'publish_date',
        'description',
        'featured',
        'code',
        'type',
        'article_type',
        'user_id'
    ];

    protected function casts(): array
    {
        return [
            'type' => PostType::class,
            /** Solo en type = article: decide si va en articles_works o en articles_authors (la BD lo exige). */
            'article_type' => ArticleType::class,
            'user_id' => 'integer',
        ];
    }



    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('cover')->singleFile();
        $this->addMediaCollection('gallery');
    }

    // Funciones de Relaciones

    /** Usuario a que pertenece */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function works(): BelongsToMany
    {
        return $this->belongsToMany(Work::class, 'articles_works')
            ->using(ArticleWork::class)
            ->withPivot('user_id')
            ->withTimestamps();
    }

    /** Solo para escribir (attach/detach). Para leer usa author(): la relación es 1:1. */
    public function authors(): BelongsToMany
    {
        return $this->belongsToMany(Author::class, 'articles_authors')
            ->using(ArticleAuthor::class)
            ->withTimestamps();
    }

    /** Author al que pertenece este post (solo article_type = author). */
    public function author(): HasOneThrough
    {
        return $this->hasOneThrough(Author::class, ArticleAuthor::class, 'post_id', 'id', 'id', 'author_id');
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
        return $query->articles()->where('article_type', $type);
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
        return $query->where('featured', true);
    }

    public function scopePublishPosts(Builder $query): Builder
    {
        return $query
            ->whereNotNull('publish_date')
            ->where('publish_date', '<=', now());
    }


    public function isOwnedBy(User $user): bool
    {
        return $this->user_id === $user->id;
    }


    public function activePermissionFor(User $user): ?RequestPermission
    {
        return $this->permissionRequests()
            ->where('user_id', $user->id)
            ->activeWindow()
            ->latest('access_expires_at')
            ->first();
    }


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


    public function resolveImage(string $key): ?Media
    {
        $this->loadMissing('images.media');

        return $this->images->firstWhere('key', $key)?->media;
    }


    //-- Custom functions --


    public static function featuredWithWorksGroupedByUser(): Collection
    {
        return static::ofArticleType(ArticleType::Work)
            ->where('featured', true)
            ->with(['works.media', 'user', 'works.tags', 'works.authors'])
            ->get()
            ->groupBy('user_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }


    /**
     * Manejo de posts con cache
     */
    protected static function booted(): void
    {
        static::saved(fn() => Cache::forget('legality_posts'));
        static::deleted(fn() => Cache::forget('legality_posts'));
    }
}
