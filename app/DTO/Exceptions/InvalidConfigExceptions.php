<?php

namespace App\DTO\Exceptions;

use InvalidArgumentException;
use Throwable;
use Override;

class InvalidConfigExceptions extends InvalidArgumentException
{

    public function __construct(
        public readonly string $field,
        string $message,
    ) {
        parent::__construct("Config inválido en '{$field}': {$message}");
    }
}
