<?php

namespace App\Enums;

/** Debe coincidir con el enum de la columna posts.type */
enum PostType : string
{
    case Article = 'article';
    case Legality = 'legality';
    case Community = 'community';
    case Policy = 'policies';
}
