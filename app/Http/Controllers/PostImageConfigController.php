<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdatePostConfigRequest;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostImageConfigController extends Controller
{
    public function index()
    {

        $posts = Post::whereNotNull('cover')
            ->whereNotNull('cover_card')
            ->get();

        return Inertia::render('post/format', [
            'posts' => $posts,
        ]);
    }


    public function temp()
    {
        $posts = Post::whereNotNull('cover')
            ->whereNotNull('cover_card')
            ->get();

        return Inertia::render('post/example', [
            'posts' => $posts,
        ]);
    }

    public function update(UpdatePostConfigRequest $request, Post $post)
    {
        $data = $request->validated();

        $post->update([
            'config' => array_merge($post->config ?? [], $data),
        ]);

        return back()->with('succes', 'Propiedad Modificada');
    }
}
