<?php

namespace App\Filters;

use App\Enums\PostFilterType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Relation;

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

    /**
     * ?search= busca únicamente en el título del post.
     *
     * Para listados donde todos los posts son del mismo usuario (taller):
     * buscar también por nombre de usuario devolvería todos los resultados.
     * Acepta también una relación (p. ej. Auth::user()->posts()) sin tener que extraer su Builder.
     */
    public function applyTitle(Builder|Relation $query): Builder|Relation
    {
        $query->when(
            $this->filters['search'] ?? null,
            fn($q, $v) => $q->searchTitle($v)
        );

        return $query;
    }


    /** ?status= filtra por estado: all | publish | pending | drafts */
    public function applyPostStatus(Builder|Relation $query): Builder|Relation
    {
        $query->when(
            PostFilterType::tryFrom($this->filters['status'] ?? ''),
            fn($q, PostFilterType $type) => $q->postStatus($type)
        );

        return $query;
    }
}
