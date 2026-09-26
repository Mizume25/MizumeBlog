<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequestPermission extends Model
{
    protected $fillable = [
        'message',
        'status',
        'granted_at',
        'access_expires_at',
        'requested_at',
        'granted_by',
        'user_id',
        'post_id'
    ];
}
