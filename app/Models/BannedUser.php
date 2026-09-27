<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;


class BannedUser extends Model
{
    protected $fillable = [
        'email',
        'ip_address',
        'reason',
        'banned_by',
    ];

    public function bannedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'banned_by');
    }

    // --- Scopes ---

    public function scopeForEmail(Builder $query, string $email): Builder
    {
        return $query->where('email', $email);
    }

    public function scopeForIp(Builder $query, string $ip): Builder
    {
        return $query->where('ip_address', $ip);
    }

    // --- Accessors ---

    protected function bannedAt(): Attribute
    {
        return Attribute::get(fn() => $this->created_at);
    }

    // --- Consulta principal ---

    public static function isBanned(string $email, ?string $ip = null): bool
    {
        return static::query()
            ->where(function (Builder $query) use ($email, $ip) {
                $query->where('email', $email);

                if ($ip !== null) $query->orWhere('ip_address', $ip);
                
            })
            ->exists();
    }
}
