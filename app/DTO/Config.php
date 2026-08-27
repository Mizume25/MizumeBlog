<?php

namespace App\DTO;

use App\DTO\Exceptions\InvalidConfigExceptions;
use App\DTO\ArticleConfig;
use App\Enums\PositionType;
use Illuminate\Contracts\Support\Arrayable;
use JsonSerializable;

final class Config implements JsonSerializable, Arrayable
{

    private PositionType $home;
    private ArticleConfig $article;
    private PositionType $card;
    private string $accent;

    /* Construir un objeto con valores por defecto */
    public function __construct(?PositionType $home = null, ?ArticleConfig $article = null, ?PositionType $card = null, ?string $accent = null)
    {
        $this->home = $home ?? PositionType::from('center');
        $this->article = $article ?? new ArticleConfig('0', PositionType::from('center'));
        $this->card = $card ?? PositionType::from('center');
        $this->accent = $accent ?? '#ffffff';
    }


    /** Construir clase con un array de valores */
    public static function fromArray(array $data): self
    {
        return new self(
            home: isset($data['home']) ? self::parsePosition($data['home'], 'home') : null,
            article: isset($data['article']) ? ArticleConfig::fromArray($data['article']) : null,
            card: isset($data['card']) ? self::parsePosition($data['card'], 'card') : null,
            accent: $data['accent'] ?? null,
        );
    }

    /** Transformacion en Array */
    public function toArray(): array
    {
        return [
            'home' => $this->home->value,
            'article' => $this->article->toArray(),
            'card' => $this->card->value,
            'accent' => $this->accent,
        ];
    }

    /** Objeto Seriado en JSON */
    public function jsonSerialize(): array
    {
        return $this->toArray();
    }

    /** Getters de la clase */
    public function getHome()
    {
        return $this->home;
    }
    public function getArticle()
    {
        return $this->article;
    }
    public function getCard()
    {
        return $this->card;
    }
    public function getAccent()
    {
        return $this->accent;
    }

    /** Seters de la clase */
    public function setHome(PositionType $home)
    {
        $this->home = $home;
    }
    public function setArticle(ArticleConfig $article)
    {
        $this->article = $article;
    }
    public function setCard(PositionType $card)
    {

        $this->card = $card;
    }

    public function setAccent(string $accent)
    {
        if (!preg_match('/^#[0-9A-Fa-f]{6}$/', $accent)) throw new InvalidConfigExceptions('accent', "'{$accent}' no es un color hexadecimal válido");

        $this->accent = $accent;
    }

    /** Parsear posiciones de un array de valores crudos */
    private static function parsePosition(string $value, string $field): PositionType
    {
        $enum = PositionType::tryFrom($value);

        if ($enum === null) {
            throw new InvalidConfigExceptions($field, "'{$value}' no es una posición válida");
        }

        return $enum;
    }
}
