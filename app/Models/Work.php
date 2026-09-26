<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Work extends Model
{
    protected $fillable = [
        'title',
        'abbreviation',
        'category',
        'publish_date',
        'sinopsi',
        'medium',
    ];
}
