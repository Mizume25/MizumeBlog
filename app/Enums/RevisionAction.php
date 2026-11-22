<?php

namespace App\Enums;

/** Qué hace una revisión sobre su ficha. */
enum RevisionAction: string
{
    case Create = 'create';
    case Update = 'update';
    case Delete = 'delete';
    case Restore = 'restore';
}
