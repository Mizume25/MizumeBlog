<?php

namespace App\Enums;

/** Estado de una ficha neutra (Work, Author): se puede usar estando pending, en público se marca "sin verificar". */
enum EntityStatus: string
{
    case Pending = 'pending';
    case Verified = 'verified';

    public function isVerified(): bool
    {
        return $this === self::Verified;
    }
}
