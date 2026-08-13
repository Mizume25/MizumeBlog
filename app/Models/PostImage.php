<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostImage extends Model
{
    protected $fillable = [
        'post_id',
        'artwork_image_id',
        'key'
    ];

    /** Pertence a un post */
    public function post() 
    {
        return $this->belongsTo(Post::class);
    }

    /** Pertence a un artwork image */
    public function images()
    {
        return $this->belongsTo(ArtworkImage::class);
    } 

    
    
}
