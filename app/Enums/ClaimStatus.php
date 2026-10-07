<?php

namespace App\Enums;

enum ClaimStatus: string
{
    case PendingVerification = 'pending_verification';
    case UnderReview = 'under_review';
    case Approved = 'approved';
    case Rejected = 'rejected';

    public function isFinish(): bool
    {
        return match ($this) {
            self::Approved, self::Rejected => true,
            default => false,
        };
    }
}
