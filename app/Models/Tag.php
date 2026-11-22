<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedTranslations;
use App\Models\Concerns\Revisionable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Tag de las obras: ficha neutra de bajo riesgo.
 * Se crea al momento (sin cola) pero cada cambio queda en el historial y es reversible.
 */
class Tag extends Model
{
    use HasFactory;
    use SoftDeletes;
    use HasLocalizedTranslations;
    use Revisionable;

    /** Traducible: {"es": ..., "en": ...} */
    public array $translatable = ['name'];

    protected $fillable = ['name'];

    public function works(): BelongsToMany
    {
        return $this->belongsToMany(Work::class, 'works_tags')->withTimestamps();
    }

    public function scopePopular(Builder $query): Builder
    {
        return $query->withCount('works')->orderByDesc('works_count');
    }

    /** Orden alfabético en el idioma actual (si falta, castellano). */
    public function scopeAlphabetical(Builder $query): Builder
    {
        return $query->orderByTranslation('name');
    }

    /**
     * Busca el tag por nombre en cualquier idioma (ignora mayúsculas y tildes) y, si no existe,
     * lo crea en el idioma actual. Si estaba borrado, lo restaura en vez de duplicarlo.
     */
    public static function findOrCreateNormalized(string $name): self
    {
        $name = trim($name);

        $tag = static::withTrashed()->whereTranslationIs('name', $name)->first();

        if ($tag?->trashed()) {
            $tag->restore();
        }

        return $tag ?? static::create(['name' => $name]);
    }
}
