<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArtworkImage extends Model
{
    protected $fillable = [
        'artwork_id',
        'num',
        'name',
    ];

    /** Pertence a un Artwork especifico */
    public function artwork () 
    {
        return $this->belongsTo(Artwork::class );
    }
}
