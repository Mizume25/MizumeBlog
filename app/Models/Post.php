<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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

    public function comentarios()
    {
        return $this->hasMany(Comentario::class);
    }
}
