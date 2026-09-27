<?php

namespace App\Enums;

enum UserRole : string
{
    case User = 'user';
    case Editor = 'editor';
    case Admin = 'admin';

    public function level(): int
    {
        return match ($this) {
            self::User => 1,
            self::Editor => 2,
            self::Admin => 3,
        };
    }

    public function atLeast(self $role): bool
    {
        return $this->level() >= $role->level();
    }
}
