<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use AWS\CRT\HTTP\Request;
use Illuminate\Support\Facades\Auth;

class ApiController extends Controller
{
    /** Ruta json que obtiene post no publicados */
    public function upcoming()
    {
        $posts = Post::notPublish()->get();

        return response()->json($posts);
    }


    /** Historial de comentarios */
    public function apiComments(int $post_id)
    {
        $comments = Comment::with(['user', 'replies.user'])
            ->where('user_id', Auth::id())
            ->where('post_id', $post_id)
            ->latest()
            ->paginate(3);

        return response()->json($comments);
    }
}
