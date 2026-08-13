<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArtworkImage extends Model
{
    protected $fillable = [
        'artwork_id',
        'num',
        'name',
        'alt'
    ];

    /** Pertence a un Artwork especifico */
    public function artwork () 
    {
        return $this->belongsTo(Artwork::class );
    }

    public function images()
    {
        return $this->hasMany(ArtworkImage::class);
    }
}
