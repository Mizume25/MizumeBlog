<?php

namespace App\Http\Controllers;

use App\Filters\AuthorFilter;
use App\Http\Requests\Filters\AuthorFilterRequest;
use App\Models\Author;
use Inertia\Inertia;

class AuthorController extends Controller
{
    public function index(AuthorFilterRequest $request)
    {

        $filters = $request->validated();

        $filter = new AuthorFilter($filters);


        $paginated = $filter->apply(Author::query())->paginate(6)->withQueryString();

        $active = array_filter($filters, fn($v) => $v !== null && $v !== '');

        // now() en vez de flash() para que el mensaje no sobreviva a la siguiente petición
        if (!empty($active)) {
            session()->now('success', $this->message($active, $paginated->total()));
        }

        return Inertia::render('authors/index', [
            'paginated' => $paginated,
            'filters'   => (object) $filters,
        ]);
    }

    private function message(array $filters, int $total): string
    {
        $labels = [
            'search' => 'Búsqueda',
            'year'   => 'Desde el año',
        ];

        $parts = [];

        foreach ($filters as $k => $v) {
            $parts[] = ($labels[$k] ?? $k) . ": {$v}";
        }

        return "Filtros aplicados (" . implode(', ', $parts) . ") — {$total} resultado(s)";
    }
}
