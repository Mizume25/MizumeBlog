<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Comment;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;
use App\Enums\ContentType;

class Post extends Model
{
    protected $casts = [
        'config' => 'array',
    ];


    //Propiedades de Modelo
    protected $fillable = [
        'title',
        'web_title',
        'tags',
        'category',
        'author',
        'publish_date',
        'description',
        'featured',
        'cover',
        'cover_card',
        'config',
        'code'
    ];

    /**
     * Relacion una categoria tiene varias categorias hijas
     * @return HasMany  
     */
    public function comments()
    {
        return $this->hasMany(Comment::class, 'post_id');
    }

    /**
     * Tenemos varias imagenes
     * @return HasMany
     */
    public function images()
    {
        return $this->hasMany(PostImage::class);
    }

    // En Post.php
    public function artworks()
    {
        return $this->belongsToMany(Artwork::class, 'artwork_post')->withTimestamps();
    }


    /**
     * Filtra todos los posts "Destacados"
     * @param Builder $query Consulta de destacados
     */
    public function scopeFeatured(Builder $query)
    {
        return $query->where('featured', true);
    }

    /**
     * 
     * Filtra todos los posts "publicados"
     * @param Builder $query
     */
    public function scopePublish(Builder $query)
    {
        return $query->whereNotNull('publish_date');
    }

    /**
     * 
     * Filtra todos los posts "publicados"
     * @param Builder $query
     */
    public function scopeNotPublish(Builder $query)
    {
        return $query->whereNull('publish_date');
    }

    private static function distinctValues(string $column)
    {
        return self::select($column)
            ->whereNotNull($column)
            ->distinct()
            ->orderBy($column)
            ->pluck($column);
    }

    /** Obtener todos los tags */
    public static function tags()
    {
        return self::distinctValues('tags');
    }

    /** Obtener todos las categorias */
    public static function categories()
    {
        return self::distinctValues('category');
    }

    /** Obtener todas las confgiuraciones */
    public static function formats()
    {
        return self::distinctValues('config');
    }

    /** Genera codigo unico para contenido de post */
    protected static function generate(string $title): string
    {
        do {

            $pre = substr($title, 0, 2);
            $suf = Str::random(4);

            $code = strtoupper("{$pre}-{$suf}");
        } while (static::where('code', $code)->exists());

        return $code;
    }

    /** Genera codigo automaticamente */
    protected static function booted()
    {
        static::creating(function ($post) {
            $post->title = static::conventions($post->title);
            $post->web_title = static::conventions($post->web_title);
            $post->author = static::conventions($post->author);

            if (empty($post->code)) {
                $post->code = static::generate($post->title);
            }
        });

        static::updating(function ($post) {
            $post->title = static::conventions($post->title);
            $post->web_title = static::conventions($post->web_title);
            $post->author = static::conventions($post->author);
        });
    }
    /** Ruta de contenido */
    public function path(ContentType $type): string
    {
        return "blog/{$this->code}/{$type->value}";
    }

    private static function conventions(string $value): string
    {
        return mb_strtolower(str_replace(' ', '-', trim($value)), 'UTF-8');
    }
}
