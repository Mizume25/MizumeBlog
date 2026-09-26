<?php

namespace App\Enums;

enum WorkMedium : string
{
    case Libro = 'libro';
    case Poema = 'poema';
    case NovelaLigera = 'novela_ligera';
    case Novela = 'novela';
    case Anime = 'anime';
    case Manga = 'manga';
    case Pelicula = 'pelicula';
}
