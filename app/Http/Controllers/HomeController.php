<?php

namespace App\Http\Controllers;


use App\Models\Post;
use Inertia\Inertia;
use App\Services\FileContentService;



class HomeController extends Controller
{

    private FileContentService $files;

    /**
     * Obtener Post Destacados
     */
    private function getFeaturedPost()
    {
        /**
         * Creamos una coleccion y extraemos los post
         */
        $featured = collect();
        $posts = Post::all();

        /**
         * Construiremos los posts destacados y publicados
         */
        foreach ($posts as $post) {
            if ($post->destacado != 0 && $post->publicado)  $featured->push($post);
        }

        return $featured;
    }





    /**
     * Vista que carga Dashboard Pirncipal con post Destacados
     */
    public function index()
    {
        //Recibimos solo los post destacados
        $posts = $this->getFeaturedPost();

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

        $post = Post::with('comments')->findOrFail($id);


        $path = $this->files->getPath($post->id, $post->title);

        /** Obtenemos el indice y el contenido */
        $json = file_get_contents($path . '/' . 'index.json');
        $md = file_get_contents($path . '/' . 'content.md');


        $index = json_decode($json, true);

        /** Construimos el objeto */
        $content = [
            "post" => $post,
            "index" => $index,
            "body" => $md
        ];

        /** Renderizamos */
        return Inertia::render('post/show', compact('content'));
    }



    

   

    public function archivador()
    {
        $posts = $this->getFeaturedPost()->toArray();

        return Inertia::render('post/archivador', compact('posts'));
    }
}
