<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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


    // Comentario 
    public function replies()
    {
        return $this->hasMany(Comentario::class, 'parent_id');
    }

    public function parent()
    {
        return $this->belongsTo(Comentario::class, 'parent_id');
    }

    public function isReply(): bool
    {
        return !is_null($this->parent_id);
    }
}
