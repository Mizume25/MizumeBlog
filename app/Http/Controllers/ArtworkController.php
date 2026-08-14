<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ArtworkController extends Controller
{
    public function create () 
    {
        return Inertia::render('IMG/create');
    }
}
