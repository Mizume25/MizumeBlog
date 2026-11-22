<?php

namespace App\Models\Concerns;

use App\Enums\RevisionAction;
use App\Enums\RevisionSource;
use App\Enums\RevisionStatus;
use App\Models\EntityRevision;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * Historial de una ficha neutra (Work, Author, Tag) en entity_revisions.
 *
 * Red de seguridad: todo create / update / delete / restore aplicado sobre el modelo
 * queda registrado como revisión aprobada, venga de donde venga (controlador, tinker, seeder).
 * Solo se guarda el diff; los campos traducibles se desglosan por idioma ("sinopsi.en").
 *
 * El flujo de propuestas (status = pending, sin aplicar) lo hará RevisionService;
 * al aplicar una propuesta usará EntityRevision::withoutRecording() para no duplicarla.
 */
trait Revisionable
{
    /** Campos que no se registran en el diff. */
    protected function revisionIgnoredAttributes(): array
    {
        return ['id', 'created_at', 'updated_at', 'deleted_at'];
    }

    public static function bootRevisionable(): void
    {
        static::created(fn(self $model) => $model->recordRevision(RevisionAction::Create, $model->revisionDiff(creating: true)));

        static::updated(function (self $model) {
            $diff = $model->revisionDiff(creating: false);

            if ($diff !== []) {
                $model->recordRevision(RevisionAction::Update, $diff);
            }
        });

        static::deleted(fn(self $model) => $model->recordRevision(RevisionAction::Delete, []));

        if (method_exists(static::class, 'restored')) {
            static::restored(fn(self $model) => $model->recordRevision(RevisionAction::Restore, []));
        }
    }

    public function revisions(): MorphMany
    {
        return $this->morphMany(EntityRevision::class, 'revisable')->latest('id');
    }

    public function pendingRevisions(): MorphMany
    {
        return $this->revisions()->pending();
    }

    /**
     * Registra el cambio de una relación (authors, tags...) como arrays de ids.
     * Las relaciones belongsToMany no disparan eventos del modelo.
     */
    public function recordRelationChange(string $relation, array $old, array $new): void
    {
        $old = array_values(array_unique(array_map('intval', $old)));
        $new = array_values(array_unique(array_map('intval', $new)));
        sort($old);
        sort($new);

        if ($old !== $new) {
            $this->recordRevision(RevisionAction::Update, [$relation => ['old' => $old, 'new' => $new]]);
        }
    }

    /**
     * Diff de los atributos modificados: { campo: { old, new } }.
     * Válido en los eventos created/updated (los originales aún no se han sincronizado).
     */
    protected function revisionDiff(bool $creating): array
    {
        $changes = [];
        $ignored = $this->revisionIgnoredAttributes();
        $translatable = method_exists($this, 'getTranslatableAttributes') ? $this->getTranslatableAttributes() : [];

        foreach ($this->getDirty() as $key => $new) {
            if (in_array($key, $ignored, true)) {
                continue;
            }

            $old = $creating ? null : $this->getRawOriginal($key);

            if (! in_array($key, $translatable, true)) {
                $changes[$key] = ['old' => $old, 'new' => $new];
                continue;
            }

            $oldLocales = is_string($old) ? (json_decode($old, true) ?: []) : [];
            $newLocales = is_string($new) ? (json_decode($new, true) ?: []) : [];

            foreach (array_unique([...array_keys($oldLocales), ...array_keys($newLocales)]) as $locale) {
                $o = $oldLocales[$locale] ?? null;
                $n = $newLocales[$locale] ?? null;

                if ($o !== $n) {
                    $changes["{$key}.{$locale}"] = ['old' => $o, 'new' => $n];
                }
            }
        }

        return $changes;
    }

    protected function recordRevision(RevisionAction $action, array $changes): void
    {
        if (! EntityRevision::isRecording()) {
            return;
        }

        $user = auth()->user();
        $isModerator = $user?->isAdmin() ?? false;

        $this->revisions()->create([
            'action'      => $action,
            'changes'     => $changes,
            'status'      => RevisionStatus::Approved,
            'source'      => match (true) {
                $user === null => RevisionSource::System,
                $isModerator   => RevisionSource::Moderator,
                default        => RevisionSource::User,
            },
            'user_id'     => $user?->id,
            'reviewed_by' => $isModerator ? $user->id : null,
            'reviewed_at' => now(),
        ]);
    }
}
