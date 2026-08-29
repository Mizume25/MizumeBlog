<?php 

namespace App\DTO;

use App\Enums\PositionType;
use Illuminate\Contracts\Support\Arrayable;
use JsonSerializable;

final class ArticleConfig implements JsonSerializable, Arrayable
{
    private string $height;
    private PositionType $position;

    public function __construct(string $height, PositionType $position)
    {
        $this->height = $height;
        $this->position = $position;
    }

    public static function fromArray(array $data): self
    {
        return new self(
            height: $data['height'] ?? '30vh',
            position: PositionType::from($data['position'] ?? 'center'),
        );
    }

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
