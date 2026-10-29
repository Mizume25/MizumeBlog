<?php

namespace App\Filters;

use App\Enums\WorkCategory;
use App\Enums\WorkMedium;
use Illuminate\Database\Eloquent\Builder;

class WorkFilters
{
    public function __construct(private array $filters) {}

    public function apply(Builder $query)
    {
        $query
            ->when(
                $this->filters['category'] ?? null,
                fn($q, $v) => $q->ofCategory(WorkCategory::from($v))
            )
            ->when(
                $this->filters['search'] ?? null,
                fn($q, $v) => $q->search($v)
            )->when(
                $this->filters['medium'] ?? null,
                fn($q, $v) => $q->ofMedium(WorkMedium::from($v))
            );

        foreach ($this->filters['tags'] ?? [] as $tag) {
            $query->withTag($tag);
        }

        return $query;
    }
}
