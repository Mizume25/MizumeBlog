<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Comment;

class Post extends Model
{
    //Propiedades de Modelo
    protected $fillable = [
        'title',
        'web_title',
        'gender',
        'category',
        'autor',
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
}
