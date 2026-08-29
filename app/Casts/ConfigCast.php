<?php

namespace App\Casts;

use App\DTO\Config;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

final class ConfigCast implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): ?Config
    {
        if ($value === null) {
            return null;
        }

        $data = json_decode($value, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \RuntimeException("Config JSON inválido en post id {$model->getKey()}: " . json_last_error_msg());
        }

        return Config::fromArray($data);
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        if ($value === null) {
            return null;
        }

        if (!$value instanceof Config) {
            $value = Config::fromArray((array) $value);
        }

        return json_encode($value->toArray());
    }
}