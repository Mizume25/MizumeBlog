<?php

namespace App\Models;

use App\Enums\PermissionStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RequestPermission extends Model
{   


    use HasFactory;

    /** Variables de tiempo */
    private const EXPIRY_DAYS = 7;
    private const ACCESS_WINDOW_HOURS = 24;

    /** Propiedades */
   protected $fillable = ['message', 'user_id', 'post_id'];


     protected function casts(): array
    {
        return [
            'status' => PermissionStatus::class,
            'requested_at' => 'datetime',
            'granted_at' => 'datetime',
            'access_expires_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (RequestPermission $request) {
            $request->requested_at ??= now();
            $request->status ??= PermissionStatus::Pending;
        });
    }

    // --- Relaciones ---

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function granter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'granted_by');
    }

    // --- Scopes ---

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', PermissionStatus::Pending);
    }


    public function scopeStaleForExpiry(Builder $query): Builder
    {
        return $query->pending()
            ->where('requested_at', '<=', now()->subDays(self::EXPIRY_DAYS));
    }

    public function scopeActiveWindow(Builder $query): Builder
    {
        return $query->whereIn('status', [PermissionStatus::Accepted, PermissionStatus::Used])
            ->where('access_expires_at', '>', now());
    }

 

    public function accept(User $granter): void
    {
        $this->update([
            'status' => PermissionStatus::Accepted,
            'granted_by' => $granter->id,
            'granted_at' => now(),
            'access_expires_at' => now()->addHours(self::ACCESS_WINDOW_HOURS),
        ]);
    }

    public function deny(User $granter): void
    {
        $this->update([
            'status' => PermissionStatus::Denied,
            'granted_by' => $granter->id,
            'granted_at' => now(),
        ]);
    }


    public function markUsed(): void
    {
        if ($this->status === PermissionStatus::Accepted) {
            $this->update(['status' => PermissionStatus::Used]);
        }
    }

  
    public function expire(): void
    {
        $this->update(['status' => PermissionStatus::Expired]);
    }

    public function isActive(): bool
    {
        return in_array($this->status, [PermissionStatus::Accepted, PermissionStatus::Used], true)
            && $this->access_expires_at?->isFuture();
    }
}
