<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Work;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __invoke()
    {   

        $works = Work::withFeaturedPost()->get();

        return Inertia::render('main', compact('works'));
    }
}
