<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function home()
    {
        $posts = Post::featuredWithWorksGroupedByUser();

        $works = $posts
            ->flatten()
            ->pluck('works')
            ->flatten()
            ->unique('id')
            ->values();

        return Inertia::render('main', [
            'works' => $works,
            'posts' => $posts,
        ]);
    }

}
