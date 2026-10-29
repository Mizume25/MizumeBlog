<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Filters\WorkFilterRequest;
use App\Models\Post;
use App\Models\Tag;
use App\Models\Work;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Filters\WorkFilters;

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
        return Inertia::render('works/show', compact('work'));
    }



}
