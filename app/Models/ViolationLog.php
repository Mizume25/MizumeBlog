<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ViolationLog extends Model
{
    protected $fillable = [
        'action',
        'attempts_count',
        'post_id',
        'user_id'
    ];
}
