<?php

return [
    'authors' => [
        'messages' => [
            'search' => 'Search',
            'year'   => 'Since the year',
        ],
        'applied' => 'Filters applied (:filters) — :total result|Filters applied (:filters) — :total results',
    ],

    'works' => [
        'messages' => [
            'search'   => 'Search',
            'category' => 'Category',
            'medium'   => 'Format',
            'tags'     => 'Tags',
        ],
        // Valores de App\Enums\WorkCategory
        'categories' => [
            'literatura' => 'Literature',
            'animemanga' => 'Anime & Manga',
        ],
        // Valores de App\Enums\WorkMedium
        'mediums' => [
            'libro'         => 'Book',
            'poema'         => 'Poem',
            'novela_ligera' => 'Light novel',
            'novela'        => 'Novel',
            'anime'         => 'Anime',
            'manga'         => 'Manga',
            'pelicula'      => 'Movie',
        ],
        'applied' => 'Filters applied (:filters) — :total work|Filters applied (:filters) — :total works',
    ],
];
