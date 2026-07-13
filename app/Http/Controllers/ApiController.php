<?php

namespace App\Http\Controllers;
use App\Models\Post;

class ApiController extends Controller
{   
    /** Ruta json que obtiene post no publicados */
    public function upcoming() 
    {
        $posts = Post::notPublish()->get();

        return response()->json($posts);
    }
}
