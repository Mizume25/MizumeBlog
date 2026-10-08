<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostImage extends Model
{   
    use HasFactory;
    protected $fillable = [
        'key',
        'post_id',
        'media_id'
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function media(): BelongsTo
    {
        return $this->belongsTo(Media::class);
    }

    /**
     * El esquema no garantiza que $media pertenezca a $post (§ riesgos del
     * primer día), así que la validación va aquí, en el único punto de
     * escritura, no en el controlador.
     */
    public static function attach(Post $post, string $key, Media $media): self
    {
        if ($media->model_type !== Post::class || $media->model_id !== $post->id) {
            throw new \InvalidArgumentException(
                "El media {$media->id} no pertenece al post {$post->id}."
            );
        }

        return static::updateOrCreate(
            ['post_id' => $post->id, 'key' => $key],
            ['media_id' => $media->id]
        );
    }
}
