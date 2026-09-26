<?php

namespace App\Enums;

enum PermissionStatus : string
{
    case Pending = 'pending';
    case Accepted = 'accepted';
    case Denied = 'denied';
    case Expired = 'expired';
    case Used = 'used';

    /** Estados de los que ya no se sale. */
    public function isFinal(): bool
    {
        return match ($this) {
            self::Denied, self::Expired, self::Used => true,
            default => false,
        };
    }
}
