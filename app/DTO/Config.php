<?php

namespace App\DTOs;

use App\DTOs\ArticleConfig;
use Illuminate\Contracts\Support\Arrayable;
use JsonSerializable;

final class Config implements JsonSerializable, Arrayable
{
    /** Construir objeto con valores determinados */
    public function __construct(
        public readonly string $home = 'center',
        public readonly ArticleConfig $article = new ArticleConfig('0', 'center'),
        public readonly string $card = 'center',
        public readonly string $accent = '#000000',
    ) {}

    /**Obtener objeto de un array */
    public static function fromArray(array $data): self
    {
        return new self(
            home: $data['home'] ?? 'center',
            article: ArticleConfig::fromArray($data['article'] ?? []),
            card: $data['card'] ?? 'center',
            accent: $data['accent'] ?? '#000000',
        );
    }

    /** Convertir en un array */
    public function toArray(): array
    {
        return [
            'home' => $this->home,
            'article' => $this->article->toArray(),
            'card' => $this->card,
            'accent' => $this->accent,
        ];
    }

    /** Serializar a json */
    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
