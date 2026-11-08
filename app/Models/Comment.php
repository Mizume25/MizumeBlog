<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Comment extends Model
{   
    use HasFactory;
    //Modelo de Comentario
    protected $fillable = [
        'description',
        'publish_date',
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
        return $this->hasMany(Comment::class, 'parent_id');
    }

    /**
     * Respuesta en relacion a un padre
     * @return BelongsTo 
     */
    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    
    /**
     * Hilo de un post: comentarios principales (más recientes primero) con sus respuestas y autores
     */
    public function scopeThreadOf(Builder $query, int $postId): Builder
    {
        return $query
            ->where('post_id', $postId)
            ->whereNull('parent_id')
            ->with(['user', 'replies.user'])
            ->latest('id');
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
