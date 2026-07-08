<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    //Propiedades de Modelo
    protected $fillable = [
        'titulo',
        'web_title',
        'genero',
        'categoria',
        'autor',
        'fecha_publicacion',
        'descripcion',
        'destacado',
        'portada',
        'card',
        'publicado'
    ];

    /**
     * Relacion una categoria tiene varias categorias hijas
     * @return HasMany  
     */
    public function comentarios()
    {
        return $this->hasMany(Comentario::class, 'post_id');
    }
}
