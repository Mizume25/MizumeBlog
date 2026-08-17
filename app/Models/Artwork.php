<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Artwork extends Model
{
    protected $fillable = [
        'title',
        'code',
    ];

    /** Relaciona varios artworks images */
    public function images()
    {
        return $this->hasMany(ArtworkImage::class, 'artwork_id');
    }

    /** Relaciona varios Post */
    public function posts()
    {
        return $this->belongsToMany(Post::class, 'artwork_post')->withTimestamps();
    }

    /** Genera codigo unico para imagenes */
    protected static function generate(string $title): string
    {
        do {

            $pre = substr($title, 0, 2);
            $suf = Str::random(4);

            $code = strtoupper("{$pre}-{$suf}");
        } while (static::where('code', $code)->exists());

        return $code;
    }

    /** Genera codigo automaticamente */
    protected static function booted()
    {
        static::creating(function ($artwork) {
            $artwork->title = static::conventions($artwork->title);
            if (empty($artwork->code)) {
                $artwork->code = static::generate($artwork->title);
            }
        });
    }

    private static function conventions(string $value): string
    {
        return mb_strtolower(str_replace(' ', '-', trim($value)), 'UTF-8');
    }
}
