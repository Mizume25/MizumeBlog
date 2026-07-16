<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Comment;
use Illuminate\Database\Eloquent\Builder;

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
        'config'
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
}
