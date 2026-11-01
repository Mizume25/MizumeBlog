<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Filters\WorkFilterRequest;
use App\Models\Post;
use App\Models\Tag;
use App\Models\Work;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use App\Filters\WorkFilters;
use Storage;

class WorkController extends Controller
{
    /**
     * Lista de Obras 
     */
    public function index(WorkFilterRequest $request)
    {   
        $filters = $request->validated();

        $filter = new WorkFilters($filters);

        $paginated = $filter
        ->apply(Work::query()->with('media', 'tags', 'authors'))
        ->paginate(6)
        ->withQueryString();
        
       
        $tags = Tag::whereHas('works')->orderBy('name')->get();

        // filled() descarta null, '' y arrays vacíos (tags: [])
        $active = array_filter($filters, fn($v) => filled($v));

        // now() en vez de flash() para que el mensaje no sobreviva a la siguiente petición
        if (!empty($active)) {
            session()->now('success', $this->message($active, $paginated->total(), $tags));
        }

        return Inertia::render('works/index', [
            'paginated' => $paginated,
            'tags'      => $tags,
            'filters'   => (object) $filters,
        ]);
    }

    /**
     * Vista de Work
     */
    public function show(Work $work)
    {

        $content = Storage::disk('local')->get('Plantilla.md');

        return Inertia::render('works/show', compact('work', 'content'));
    }

    private function message(array $filters, int $total, Collection $tags): string
    {
        $parts = [];

        foreach ($filters as $k => $v) {
            // category y medium traducen su valor; tags muestra los nombres a partir de los ids
            $value = match ($k) {
                'category' => __("filters.works.categories.{$v}"),
                'medium'   => __("filters.works.mediums.{$v}"),
                'tags'     => $tags->whereIn('id', array_map('intval', $v))->pluck('name')->implode(', '),
                default    => $v,
            };

            $parts[] = __("filters.works.messages.{$k}") . ": {$value}";
        }

        return trans_choice('filters.works.applied', $total, [
            'filters' => implode(' · ', $parts),
            'total'   => $total,
        ]);
    }



}
