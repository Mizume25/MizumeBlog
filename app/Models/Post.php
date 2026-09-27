<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Enums\PostType;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;
use App\Models\PostImage;

class Post extends Model
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
        'user_id'
    ];

    protected function casts(): array
    {
        return [
            'type' => PostType::class,
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
        return $this->belongsToMany(Work::class, 'articles_works')->withTimestamps();
    }

    public function authors(): BelongsToMany
    {
        return $this->belongsToMany(Author::class, 'articles_authors')->withTimestamps();
    }

    public function images(): HasMany
    {
        return $this->hasMany(PostImage::class);
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

    public function scopePolicies(Builder $query): Builder
    {
        return $query->ofType(PostType::Policy);
    }

    public function scopeOwnedBy(Builder $query, User $user): Builder
    {
        return $query->where('user_id', $user->id);
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





    /**
     * 
     * FUNCIONES DE EL POST DE MIZUMEBLOG 1.3.0 
     */
    /*** 
    /**
     * Relacion una categoria tiene varias categorias hijas
     * @return HasMany  
     */
    //public function comments()
    //{
    //    return $this->hasMany(Comment::class, 'post_id');
    //}
    //
    ///**
    // * Tenemos varias imagenes
    // * @return HasMany
    // */
    //public function images()
    //{
    //    return $this->hasMany(PostImage::class);
    //}
    //
    //// En Post.php
    //public function artworks()
    //{
    //    return $this->belongsToMany(Artwork::class, 'artwork_post')->withTimestamps();
    //}
    //
    //
    ///**
    // * Filtra todos los posts "Destacados"
    // * @param Builder $query Consulta de destacados
    // */
    //public function scopeFeatured(Builder $query)
    //{
    //    return $query->where('featured', true);
    //}
    //
    ///**
    // * 
    // * Filtra todos los posts "publicados"
    // * @param Builder $query
    // */
    //public function scopePublish(Builder $query)
    //{
    //    return $query->whereNotNull('publish_date');
    //}
    //
    ///**
    // * 
    // * Filtra todos los posts "publicados"
    // * @param Builder $query
    // */
    //public function scopeNotPublish(Builder $query)
    //{
    //    return $query->whereNull('publish_date');
    //}
    //
    //private static function distinctValues(string $column)
    //{
    //    return self::select($column)
    //        ->whereNotNull($column)
    //        ->distinct()
    //        ->orderBy($column)
    //        ->pluck($column);
    //}
    //
    ///** Obtener todos los tags */
    //public static function tags()
    //{
    //    return self::distinctValues('tags');
    //}
    //
    ///** Obtener todos las categorias */
    //public static function categories()
    //{
    //    return self::distinctValues('category');
    //}
    //
    ///* Obtener todas las confgiuraciones 
    //public static function formats()
    //{
    //    return self::distinctValues('config');
    //}*/
    //
    ///** Genera codigo unico para contenido de post */
    //protected static function generate(string $title): string
    //{
    //    do {
    //
    //        $pre = substr($title, 0, 2);
    //        $suf = Str::random(4);
    //
    //        $code = strtoupper("{$pre}-{$suf}");
    //    } while (static::where('code', $code)->exists());
    //
    //    return $code;
    //}
    //
    ///** Genera codigo automaticamente */
    //protected static function booted()
    //{
    //    static::creating(function ($post) {
    //        $post->title = static::conventions($post->title);
    //        $post->web_title = static::conventions($post->web_title);
    //        $post->author = static::conventions($post->author);
    //
    //        if (empty($post->code)) {
    //            $post->code = static::generate($post->title);
    //        }
    //    });
    //
    //    static::updating(function ($post) {
    //        $post->title = static::conventions($post->title);
    //        $post->web_title = static::conventions($post->web_title);
    //        $post->author = static::conventions($post->author);
    //    });
    //}
    ///** Ruta de contenido */
    //public function path(ContentType $type): string
    //{
    //    return "blog/{$this->code}/{$type->value}";
    //}
    //
    //private static function conventions(string $value): string
    //{
    //    return mb_strtolower(str_replace(' ', '-', trim($value)), 'UTF-8');
    //}
    //

}
