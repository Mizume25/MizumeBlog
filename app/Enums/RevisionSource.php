<?php

namespace App\Enums;

/**
 * Origen de una revisión:
 * user      → propuesta de un usuario
 * moderator → cambio directo de un admin/editor
 * system    → cambio sin usuario autenticado (seeders, comandos, tinker)
 */
enum RevisionSource: string
{
    case User = 'user';
    case Moderator = 'moderator';
    case System = 'system';
}
