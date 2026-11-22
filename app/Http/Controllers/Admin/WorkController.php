<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkController extends Controller
{
    /**
     * Crear Work
     */
    public function create () 
    {
        $tags = Tag::all();
        return Inertia::render('works/create', compact('tags'));
        
    }
}
