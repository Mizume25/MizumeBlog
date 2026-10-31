<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class AuthorFilter
{
    public function __construct(private array $filters) {}

    public function apply(Builder $query)
    {
        $query
            ->when($this->filters['search'] ?? null, fn($q, $v) => $q->search($v))
            // isset en vez de ?? para no descartar el año 0
            ->when(isset($this->filters['year']), fn($q) => $q->birthYear((int) $this->filters['year']))
        ;
        return $query;
    }
}
