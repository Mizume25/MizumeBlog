<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Work;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __invoke()
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
