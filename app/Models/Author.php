<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
    protected $fillable = [
        'name',
        'last_name',
        'pseudonym',
        'birth_year',
        'description'
    ];
}
