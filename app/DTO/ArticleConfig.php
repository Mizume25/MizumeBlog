<?php 

namespace App\DTOs;

use Illuminate\Contracts\Support\Arrayable;
use JsonSerializable;
use Override;

final class ArticleConfig implements JsonSerializable, Arrayable
{   
    /** Constructor de la clase */
    public function __construct(
        public readonly string $height = '0',
        public readonly string $position = 'center',
    ) {}

    /**
     * Funcion para crearlo mediante array
     */
    public static function fromArray(array $data): self
    {
        return new self(
            height: $data['height'] ?? '0',
            position: $data['position'] ?? 'default',
        );
    }
    /** Funcion para transformarlo en array */
    public function toArray(): array
    {
        return [
            'height' => $this->height,
            'position' => $this->position,
        ];
    }


    public function jsonSerialize(): mixed
    {
        return $this->toArray();
    }
}

?>