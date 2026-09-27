<?php

namespace App\Enums;

enum ReportStatus : string
{
    case Pending = 'pending';
    case Resolved = 'resolved';
    case Rejected = 'rejected';

    public function isOpen(): bool
    {
        return $this === self::Pending;
    }
}
