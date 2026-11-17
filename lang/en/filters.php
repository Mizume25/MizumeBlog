<?php

return [
    'authors' => [
        'messages' => [
            'search' => 'Search',
            'year'   => 'Since the year',
        ],
        'applied' => 'Filters applied (:filters) — :total result|Filters applied (:filters) — :total results',
    ],

    'users' => [
        'messages' => [
            'search' => 'Search',
        ],
        'applied' => 'Filters applied (:filters) - :total result'
    ],

    'works' => [
        'messages' => [
            'search'   => 'Search',
            'category' => 'Category',
            'medium'   => 'Format',
            'tags'     => 'Tags',
        ],
        'categories' => [
            'literatura' => 'Literature',
            'animemanga' => 'Anime & Manga',
        ],
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

    'posts' => [
        // Label for each filter (?search=, ?status=)
        'messages' => [
            'search' => 'Search',
            'status' => 'Status',
        ],
        // Values of App\Enums\PostFilterType
        'statuses' => [
            'all'      => 'All',
            'publish'  => 'Published',
            'pendings' => 'Pending',
            'drafts'   => 'Drafts',
        ],
        // Filter result: success with results, error without them
        'applied' => [
            'success' => 'Filters applied (:filters) — :total post|Filters applied (:filters) — :total posts',
            'error'   => 'No posts found with (:filters)',
        ],
    ],
];
