<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Comment;
use Illuminate\Database\Eloquent\Builder;

class Post extends Model
{
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
        return $query->where('featured' , true);
    }

    /**
     * 
     * Filtra todos los posts "publicados"
     * @param Builder $query
     */
    public function scopePublish(Builder $query)
    {
        return $query->where('publish_date', '!=' , null);
    }

    /**
     * Obtenemos todos los Generos Actuales
     */
    public static function tags()
    {
        return self::select('tags')
            ->whereNotNull('tags')
            ->distinct()
            ->orderBy('tags')
            ->pluck('tags');
    }
}
