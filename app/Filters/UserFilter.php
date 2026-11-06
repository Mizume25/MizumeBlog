<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class UserFilter
{
    public function __construct(private array $filters) {}

    public function apply(Builder $query)
    {
        $query->when($this->filters['search'] ?? null, fn($q, $v) => $q->search($v));
        return $query;
    }
}
