<?php

namespace App\Http\Controllers\Public;

use App\Enums\PostType;
use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Services\MarkdownService;
use Inertia\Inertia;

class AboutController extends Controller
{

    private MarkdownService $service;

    public function __construct(MarkdownService $service)
    {
        $this->service = $service;
    }



    /**
     * Página única de la comunidad: mismo formato que works/show/post ({ post, build })
     */
    public function community()
    {
        $post = Post::with('user')->ofType(PostType::Community)->firstOrFail();


        return Inertia::render('community/show', [
            'post' => $post,
            'build' => fn() => $this->service->build($post),
        ]);
    }


    public function legality(string $code)
    {
        $post = Post::with('user')
            ->ofType(PostType::Legality)
            ->where('code', $code)
            ->firstOrFail();

        

        return Inertia::render('legality/show', [
            'post'  => $post,
            'build' => fn() => $this->service->build($post),
            'code' => $code,
            'title' => str_replace('-', ' ', $code)
        ]);
    }
}
