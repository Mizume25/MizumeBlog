<?php

return [
    'authors' => [
        'messages' => [
            'search' => 'Búsqueda',
            'year'   => 'Desde el año',
        ],
        'applied' => 'Filtros aplicados (:filters) — :total resultado|Filtros aplicados (:filters) — :total resultados',
    ],

    'users' => [
        'messages' => [
            'search' => 'Busqueda',
        ],
        'applied' => 'Filtro Aplicado (:filters) - :total resultados'
    ],

    'works' => [
        'messages' => [
            'search'   => 'Búsqueda',
            'category' => 'Categoría',
            'medium'   => 'Formato',
            'tags'     => 'Etiquetas',
        ],
        // Valores de App\Enums\WorkCategory
        'categories' => [
            'literatura' => 'Literatura',
            'animemanga' => 'Anime y Manga',
        ],
        // Valores de App\Enums\WorkMedium
        'mediums' => [
            'libro'         => 'Libro',
            'poema'         => 'Poema',
            'novela_ligera' => 'Novela ligera',
            'novela'        => 'Novela',
            'anime'         => 'Anime',
            'manga'         => 'Manga',
            'pelicula'      => 'Película',
        ],
        'applied' => 'Filtros aplicados (:filters) — :total obra|Filtros aplicados (:filters) — :total obras',
    ],

    'posts' => [
        // Etiqueta de cada filtro (?search=, ?status=)
        'messages' => [
            'search' => 'Búsqueda',
            'status' => 'Estado',
        ],
        // Valores de App\Enums\PostFilterType
        'statuses' => [
            'all'      => 'Todos',
            'publish'  => 'Publicados',
            'pendings' => 'Pendientes',
            'drafts'   => 'Borradores',
        ],
        // Resultado del filtrado: success con resultados, error sin ellos
        'applied' => [
            'success' => 'Filtros aplicados (:filters) — :total publicación|Filtros aplicados (:filters) — :total publicaciones',
            'error'   => 'No se encontraron publicaciones con (:filters)',
        ],
    ],
];
