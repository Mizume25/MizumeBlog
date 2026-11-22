<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;
use InvalidArgumentException;
use Spatie\Translatable\HasTranslations;

/**
 * Columnas JSON traducibles ({"es": ..., "en": ...}) con spatie/laravel-translatable.
 *
 * - Lectura: $model->title devuelve el idioma actual (SetLocale / cookie 'lang'); si falta, castellano.
 * - Serialización (Inertia / JSON): cada campo traducible sale como TEXTO del idioma actual,
 *   nunca como {es, en}. El frontend público recibe title = "valor".
 * - Edición: los formularios piden ambas versiones explícitamente con
 *   $model->getTranslations('title') o $model->append('translations').
 * - Búsqueda: en MariaDB las columnas json usan utf8mb4_bin (LIKE distingue mayúsculas),
 *   por eso los scopes comparan con COLLATE utf8mb4_unicode_ci (ignora mayúsculas y tildes).
 */
trait HasLocalizedTranslations
{
    use HasTranslations;

    /** Idioma base: el slug y la detección de duplicados se calculan sobre él. */
    public const BASE_LOCALE = 'es';

    /** Lo consulta HasTranslations::normalizeLocale() antes que app.fallback_locale ('en'). */
    public function getFallbackLocale(): string
    {
        return self::BASE_LOCALE;
    }

    /** Valor en el idioma base (sin depender del idioma de la petición). */
    public function baseTranslation(string $key): string
    {
        return (string) $this->getTranslation($key, self::BASE_LOCALE);
    }

    /** true si el campo no tiene valor propio en $locale y se mostraría el fallback. */
    public function isMissingTranslation(string $key, ?string $locale = null): bool
    {
        return ! $this->hasTranslation($key, $locale ?? app()->getLocale());
    }

    /**
     * Los campos traducibles se serializan como texto del idioma actual.
     * (HasTranslations 6.x devolvería el array completo de traducciones.)
     */
    public function attributesToArray(): array
    {
        $attributes = parent::attributesToArray();

        foreach ($this->getTranslatableAttributes() as $key) {
            if (array_key_exists($key, $attributes)) {
                $attributes[$key] = $this->getTranslation($key, $this->getLocale(), $this->useFallbackLocale());
            }
        }

        return $attributes;
    }

    // --- Scopes de búsqueda sobre JSON ---

    /** LIKE parcial en cualquier idioma disponible (ignora mayúsculas y tildes). */
    public function scopeWhereTranslationLike(Builder $query, string $column, string $term): Builder
    {
        $like = '%' . addcslashes($term, '%_\\') . '%';

        return $query->where(function (Builder $q) use ($column, $like) {
            foreach (config('app.available_locales') as $locale) {
                $q->orWhereRaw(static::translationSql($q, $column, $locale) . ' LIKE ?', [$like]);
            }
        });
    }

    /** Igualdad exacta en cualquier idioma disponible (ignora mayúsculas y tildes). Para duplicados. */
    public function scopeWhereTranslationIs(Builder $query, string $column, string $value): Builder
    {
        return $query->where(function (Builder $q) use ($column, $value) {
            foreach (config('app.available_locales') as $locale) {
                $q->orWhereRaw(static::translationSql($q, $column, $locale) . ' = ?', [trim($value)]);
            }
        });
    }

    /** Ordena por el idioma actual; si falta, por el idioma base. */
    public function scopeOrderByTranslation(Builder $query, string $column, string $direction = 'asc'): Builder
    {
        $direction = strtolower($direction) === 'desc' ? 'desc' : 'asc';
        $current = static::translationSql($query, $column, app()->getLocale());
        $base = static::translationSql($query, $column, self::BASE_LOCALE);

        return $query->orderByRaw("COALESCE({$current}, {$base}) {$direction}");
    }

    /** Expresión SQL que extrae $column->$locale como texto comparable. */
    protected static function translationSql(Builder $query, string $column, string $locale): string
    {
        if (! in_array($locale, config('app.available_locales'), true)) {
            throw new InvalidArgumentException("Idioma no soportado: {$locale}");
        }

        $wrapped = $query->getQuery()->getGrammar()->wrap($query->qualifyColumn($column));
        $path = '$."' . $locale . '"';

        return match ($query->getConnection()->getDriverName()) {
            'mysql', 'mariadb' => "JSON_UNQUOTE(JSON_EXTRACT({$wrapped}, '{$path}')) COLLATE utf8mb4_unicode_ci",
            default            => "json_extract({$wrapped}, '{$path}')",
        };
    }
}
