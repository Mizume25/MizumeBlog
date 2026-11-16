<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class PostFilter
{
    public function __construct(private array $filters) {}

    /**
     * ?search= busca en el título del post O en el nombre de su usuario.
     *
     * Las dos condiciones van agrupadas en un where(): sin el grupo, el orWhere
     * quedaría al nivel del resto de la query y se saltaría los filtros externos
     * (whereHas('works'), publishPosts()...).
     */
    public function apply(Builder $query): Builder
    {
        $query->when(
            $this->filters['search'] ?? null,
            fn($q, $v) => $q->where(
                fn(Builder $q) => $q->searchTitle($v)
                    ->orWhereHas('user', fn($u) => $u->search($v))
            )
        );

        return $query;
    }
}
