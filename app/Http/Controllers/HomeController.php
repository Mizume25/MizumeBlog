<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Inertia\Inertia;
use App\Services\FileContentService;



class HomeController extends Controller
{

    private FileContentService $files;


     public function __construct(FileContentService $files)
    {
        $this->files = $files;
    }



    /**
     * Vista que carga Dashboard Pirncipal con post Destacados
     */
    public function index()
    {
        //Recibimos solo los post destacados
        $posts = Post::featured()->latest()->limit(6)->get();

        //Retornamos el objeto filtrado
        return Inertia::render('dashboard', compact('posts'));
    }

    /**
     * @param $id
     * Vista de la página individual
     * 
     */
    public function show(int $id)
    {
        $features = Post::featured()->latest()->limit(3)->get();
        $post = Post::with('comments')->findOrFail($id);

        $comments = Comment::where('post_id', $post->id)
        ->whereNull('parent_id')
        ->with(['user', 'replies.user'])
        ->get();


        $path = $this->files->getPath($post->id, $post->title);

        /** Obtenemos el indice y el contenido */
        $json = file_get_contents($path . '/' . 'index.json');
        $md = file_get_contents($path . '/' . 'content.md');


        $index = json_decode($json, true);

        /** Construimos el objeto */
        $content = [
            "post" => $post,
            "index" => $index,
            "body" => $md,
            "comments" => $comments,
            "features" => $features,
        ];

        /** Renderizamos */
        return Inertia::render('post/show', compact('content'));
    }







    public function archivador()
    {
        $posts = Post::all();

        $categories = Post::categories();

        return Inertia::render('post/library', compact('posts', 'categories'));
    }
}
