<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ViolationLog extends Model
{   
    use HasFactory;
    
    protected $fillable = [
        'action',
        'attempts_count',
        'post_id',
        'user_id'
    ];

    // --- Relaciones ---

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    // --- Scopes ---

    public function scopeForUser(Builder $query, User $user): Builder
    {
        return $query->where('user_id', $user->id);
    }

    public function scopeRecent(Builder $query, int $hours): Builder
    {
        return $query->where('created_at', '>=', now()->subHours($hours));
    }

    // --- Escritura ---

    public static function record(User $user, string $action, ?Post $post, int $attempts): self
    {
        return static::create([
            'user_id' => $user->id,
            'post_id' => $post?->id,
            'action' => $action,
            'attempts_count' => $attempts,
        ]);
    }
}
