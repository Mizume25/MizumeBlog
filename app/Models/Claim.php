<?php

namespace App\Models;

use App\Enums\ClaimStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property array $social_proof_url
 * @property ClaimStatus $status
 * @property string $message
 * @property int|null $user_id
 */
class Claim extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'email',
        'social_proof_url',
        'message',
    ];

    protected function casts(): array
    {
        return [
            'status' => ClaimStatus::class,
            'social_proof_url' => 'array',
            'verification_token_expires_at' => 'datetime',
            'email_verified_at' => 'datetime',
            'reviewed_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Claim $claim) {
            $claimantAlreadyVerified = $claim->user_id
                && optional(User::find($claim->user_id))->email_verified_at;

            if ($claimantAlreadyVerified) {
                // Ya demostró controlar su cuenta al hacer login — se salta
                // la verificación de email de este formulario.
                $claim->status = ClaimStatus::UnderReview;
                $claim->email_verified_at = now();
            } else {
                $claim->verification_token = Str::random(64);
                $claim->verification_token_expires_at = now()->addHours(24);
                $claim->status ??= ClaimStatus::PendingVerification;
            }
        });
    }

    // --- Relaciones ---

    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class, 'claims_post', 'claims_id', 'post_id')
            ->withTimestamps();
    }

    public function media(): BelongsToMany
    {
        return $this->belongsToMany(Media::class, 'claims_media', 'claims_id', 'media_id')
            ->withTimestamps();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    // --- Scopes ---

    public function scopeAwaitingReview(Builder $query): Builder
    {
        return $query->where('status', ClaimStatus::UnderReview);
    }

    public function scopePendingVerification(Builder $query): Builder
    {
        return $query->where('status', ClaimStatus::PendingVerification);
    }

    // --- Verificación ---

    /** Invocado al pulsar el enlace del email, token de un solo uso. */
    public function verifyEmail(): bool
    {
        if ($this->status !== ClaimStatus::PendingVerification) {
            return false; // ya verificado o resuelto: el token no se reutiliza
        }

        if ($this->verification_token_expires_at?->isPast()) {
            return false;
        }

        $this->update([
            'email_verified_at' => now(),
            'status' => ClaimStatus::UnderReview,
            'verification_token' => null,
        ]);

        return true;
    }

    // --- Resolución ---

    public function approve(User $admin, ?string $notes = null): void
    {
        $this->update([
            'status' => ClaimStatus::Approved,
            'reviewed_by' => $admin->id,
            'reviewed_at' => now(),
            'resolution_notes' => $notes,
        ]);
    }

    public function reject(User $admin, ?string $notes = null): void
    {
        $this->update([
            'status' => ClaimStatus::Rejected,
            'reviewed_by' => $admin->id,
            'reviewed_at' => now(),
            'resolution_notes' => $notes,
        ]);
    }
}
