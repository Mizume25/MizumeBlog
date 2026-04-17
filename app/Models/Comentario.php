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
        'post_id'
    ];
}
