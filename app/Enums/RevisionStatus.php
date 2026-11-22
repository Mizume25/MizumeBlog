<?php

namespace App\Enums;

/** pending = en la cola de moderación · approved = aplicada (historial) · rejected = descartada. */
enum RevisionStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';

    public function isOpen(): bool
    {
        return $this === self::Pending;
    }
}
