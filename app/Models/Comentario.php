<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Comentario extends Model
{
    //Modelo de Comentario
    protected $fillable = [
        'descripcion',
        'fecha',
        'user_id',
        'post_id',
        'parent_id'
    ];


    /**
     * Comentarios Respuesta Relacionado
     * @return HasMany 
     */
    public function replies()
    {
        return $this->hasMany(Comentario::class, 'parent_id');
    }

    /**
     * Respuesta en relacion a un padre
     * @return BelongsTo 
     */
    public function parent()
    {
        return $this->belongsTo(Comentario::class, 'parent_id');
    }

    
    public function reply(): bool
    {
        return !is_null($this->parent_id);
    }

    /**
     * @return User
     * Comentarios relativos a un Usuario
     */
    public function user() 
    {
        
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return Post
     * Comentario relativo a un post
     */
    public function post() 
    {
        return $this->belongsTo(Post::class, 'post_id');
    }
}
