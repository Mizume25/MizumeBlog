<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Tag;
use App\Models\Work;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkController extends Controller
{
    /**
     * Lista de Obras 
     */
    public function index()
    {

        $works = Work::with('media', 'tags', 'authors')->get();

    

        $tags = $works
            ->flatten()
            ->pluck('tags')
            ->flatten()
            ->unique('id')
            ->values();

        return Inertia::render('works/index', compact(['works', 'tags']));
    }

    /**
     * Vista de Work
     */

    public function show(Work $work)
    {
        return Inertia::render('works/show', compact('work'));
    }
}
