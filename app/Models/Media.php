<?php

namespace App\Models;

use App\Enums\MediaType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Spatie\MediaLibrary\MediaCollections\Models\Media as BaseMedia;

/**
 * Media del proyecto (config media-library.media_model).
 *
 * Créditos del artista: cada imagen guarda los suyos en custom_properties, sin columnas nuevas:
 *   custom_properties.credit = { "artist": "Nombre", "social": "@usuario o https://..." }
 *
 * - social es texto libre: hay demasiadas redes de artistas para modelarlas.
 * - Al reutilizar una imagen ($media->copy(...)) los créditos viajan con ella.
 * - En JSON sale como `credit` (null si la imagen no tiene artista).
 */
class Media extends BaseMedia
{
    /** Clave dentro de custom_properties */
    public const CREDIT = 'credit';

    private const ARTIST_MAX = 120;
    private const SOCIAL_MAX = 255;

    protected $appends = ['original_url', 'preview_url', 'credit'];

    // --- Créditos ---

    /**
     * { artist, social, social_url } o null si no hay artista.
     * social_url solo se rellena si social es una URL http(s): nunca enlazar el texto libre
     * directamente (evita href="javascript:...").
     */
    protected function credit(): Attribute
    {
        return Attribute::get(function (): ?array {
            $artist = $this->getCustomProperty(self::CREDIT . '.artist');

            if (blank($artist)) {
                return null;
            }

            $social = $this->getCustomProperty(self::CREDIT . '.social');

            return [
                'artist'     => $artist,
                'social'     => $social,
                'social_url' => self::safeUrl($social),
            ];
        });
    }

    public function hasCredit(): bool
    {
        return filled($this->getCustomProperty(self::CREDIT . '.artist'));
    }

    /** Asigna los créditos (hay que llamar a save() después). Sin artista, los borra. */
    public function setCredit(?string $artist, ?string $social = null): self
    {
        $artist = self::clean($artist, self::ARTIST_MAX);

        if ($artist === null) {
            return $this->forgetCustomProperty(self::CREDIT);
        }

        return $this->setCustomProperty(self::CREDIT, [
            'artist' => $artist,
            'social' => self::clean($social, self::SOCIAL_MAX),
        ]);
    }

    public function forgetCredit(): self
    {
        return $this->forgetCustomProperty(self::CREDIT);
    }

    /**
     * Para encadenar al subir: $post->addMedia($file)->withCustomProperties(Media::creditProperties($artist, $social))
     */
    public static function creditProperties(?string $artist, ?string $social = null): array
    {
        $artist = self::clean($artist, self::ARTIST_MAX);

        return $artist === null ? [] : [
            self::CREDIT => ['artist' => $artist, 'social' => self::clean($social, self::SOCIAL_MAX)],
        ];
    }

    /** Reglas de validación del formulario de subida/edición (campos credit.artist y credit.social). */
    public static function creditRules(): array
    {
        return [
            'credit'        => ['nullable', 'array'],
            'credit.artist' => ['nullable', 'string', 'max:' . self::ARTIST_MAX],
            // Opcional aunque haya artista; sin artista se ignora (setCredit / creditProperties)
            'credit.social' => ['nullable', 'string', 'max:' . self::SOCIAL_MAX],
        ];
    }

    // --- Helpers ---

    private static function clean(?string $value, int $max): ?string
    {
        $value = trim((string) $value);

        return $value === '' ? null : mb_substr($value, 0, $max);
    }

    private static function safeUrl(?string $value): ?string
    {
        if ($value === null || ! filter_var($value, FILTER_VALIDATE_URL)) {
            return null;
        }

        return in_array(strtolower((string) parse_url($value, PHP_URL_SCHEME)), ['http', 'https'], true) ? $value : null;
    }

    /**
     * Funciones de filtrado
     */

    public function scopeOnCollection(Builder $query, MediaType $type)
    {
        return $query->where('collection_name', $type);
    }
}
