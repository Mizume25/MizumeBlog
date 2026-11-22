<?php

namespace App\Models\Concerns;

use App\Enums\EntityStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Estado de una ficha neutra: pending → verified.
 * Una ficha pending ya se puede usar para escribir posts (no bloquea al usuario).
 * created_by es solo atribución: NO da permisos sobre la ficha.
 */
trait HasEntityStatus
{
    public function initializeHasEntityStatus(): void
    {
        $this->mergeCasts(['status' => EntityStatus::class]);
    }

    public static function bootHasEntityStatus(): void
    {
        static::creating(function (self $model) {
            $model->created_by ??= auth()->id();
        });
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function isVerified(): bool
    {
        return $this->status === EntityStatus::Verified;
    }

    public function markAsVerified(): bool
    {
        return $this->forceFill(['status' => EntityStatus::Verified])->save();
    }

    public function scopeVerified(Builder $query): Builder
    {
        return $query->where($query->qualifyColumn('status'), EntityStatus::Verified);
    }

    public function scopeUnverified(Builder $query): Builder
    {
        return $query->where($query->qualifyColumn('status'), EntityStatus::Pending);
    }
}
