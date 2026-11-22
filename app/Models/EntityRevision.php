<?php

namespace App\Models;

use App\Enums\RevisionAction;
use App\Enums\RevisionSource;
use App\Enums\RevisionStatus;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\MassPrunable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * Cola de revisión + historial de las fichas neutras (Work, Author, Tag).
 *
 * pending  → propuesta en la cola de moderación (aún no aplicada)
 * approved → cambio aplicado: es la entrada del historial
 * rejected → descartada; se purga pasado PRUNE_REJECTED_AFTER (model:prune)
 *
 * changes: solo el diff → { "sinopsi.en": { "old": ..., "new": ... }, "authors": { "old": [1,2], "new": [1,3] } }
 */
class EntityRevision extends Model
{
    use MassPrunable;

    /** Meses que se conservan las revisiones rechazadas. */
    private const PRUNE_REJECTED_AFTER = 6;

    /** Interruptor global de Revisionable (lo usa RevisionService al aplicar una propuesta). */
    private static bool $recording = true;

    protected $fillable = [
        'action',
        'changes',
        'reason',
        'status',
        'source',
        'flags',
        'user_id',
        'reviewed_by',
        'reviewed_at',
        'review_note',
        'reverts_id',
    ];

    protected function casts(): array
    {
        return [
            'action'      => RevisionAction::class,
            'status'      => RevisionStatus::class,
            'source'      => RevisionSource::class,
            'changes'     => 'array',
            'flags'       => 'array',
            'reviewed_at' => 'datetime',
        ];
    }

    // --- Grabación ---

    public static function isRecording(): bool
    {
        return self::$recording;
    }

    /** Ejecuta $callback sin que Revisionable registre revisiones automáticas. */
    public static function withoutRecording(Closure $callback): mixed
    {
        $previous = self::$recording;
        self::$recording = false;

        try {
            return $callback();
        } finally {
            self::$recording = $previous;
        }
    }

    // --- Relaciones ---

    /** Ficha revisada; incluye las borradas (soft delete) para poder mostrar y restaurar. */
    public function revisable(): MorphTo
    {
        return $this->morphTo()->withTrashed();
    }

    /** Quién propone (o quién hizo el cambio directo). */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /** Revisión que esta deshace. */
    public function reverts(): BelongsTo
    {
        return $this->belongsTo(self::class, 'reverts_id');
    }

    /** Revisiones que deshacen a esta. */
    public function reversions(): HasMany
    {
        return $this->hasMany(self::class, 'reverts_id');
    }

    // --- Scopes ---

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', RevisionStatus::Pending);
    }

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', RevisionStatus::Approved);
    }

    public function scopeRejected(Builder $query): Builder
    {
        return $query->where('status', RevisionStatus::Rejected);
    }

    /** Cola de moderación: pendientes, las más antiguas primero. */
    public function scopeQueue(Builder $query): Builder
    {
        return $query->pending()->oldest();
    }

    public function scopeByUser(Builder $query, User $user): Builder
    {
        return $query->where('user_id', $user->id);
    }

    /** Propuestas recientes de un usuario (regla de ráfaga de RevisionGuard). */
    public function scopeRecentBy(Builder $query, User $user, int $minutes): Builder
    {
        return $query->byUser($user)->where('created_at', '>=', now()->subMinutes($minutes));
    }

    // --- Estado ---

    public function isPending(): bool
    {
        return $this->status === RevisionStatus::Pending;
    }

    public function isFlagged(): bool
    {
        return ! empty($this->flags);
    }

    /**
     * Diff de la revisión. Dentro del modelo usa SIEMPRE este método (o getAttribute):
     * $this->changes es la propiedad interna de Eloquent, no la columna.
     * Desde fuera, $revision->changes sí devuelve la columna.
     */
    public function diff(): array
    {
        return $this->getAttribute('changes') ?? [];
    }

    /** Campos tocados por la revisión ("sinopsi.en", "authors"...). */
    public function changedFields(): array
    {
        return array_keys($this->diff());
    }

    // --- Purga ---

    public function prunable(): Builder
    {
        return static::rejected()->where('updated_at', '<=', now()->subMonths(self::PRUNE_REJECTED_AFTER));
    }
}
