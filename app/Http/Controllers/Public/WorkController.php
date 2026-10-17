<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Work;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkController extends Controller
{
    public function index()
    {

        $works = Work::with('media', 'tags', 'authors')
        ->latest('id')
        ->paginate(6)
        ->withQueryString();  
        
        

        return Inertia::render('works/index', compact('works'));
    }
}
