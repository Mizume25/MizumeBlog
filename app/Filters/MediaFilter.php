<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class MediaFilter 
{
    public function __construct(private array $filters) {}

    public function apply (Builder $query) 
    {
        return $query->
        when($this->filters['type'] ?? null, fn($q, $v) => $q->oncollection($v));
    }
}