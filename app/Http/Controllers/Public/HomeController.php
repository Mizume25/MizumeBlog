<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Work;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Home: obras activadas por el admin (home_at), en su orden (home_order).
     *
     * Se destacan OBRAS, no posts: cada obra enlaza a su índice works/{slug},
     * donde se ven primero sus posts destacados. La portada sale de cover_url.
     */
    public function home()
    {
        return Inertia::render('main', [
            'works' => Work::onHome()->with(['tags', 'authors'])->get(),
        ]);
    }

    

}
