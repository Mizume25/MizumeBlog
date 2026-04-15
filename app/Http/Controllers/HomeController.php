<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

use function Symfony\Component\String\s;

class HomeController extends Controller
{   
    //Variable de la classe
    private $posts;

    //Inicializamos Cargado de Posts
    public function __construct()
    {
        $this->posts = Post::all();
    } 

    //Funcion que carga post destacados
    private function getFeaturedPost ()
    {      
        $featured = collect();
        //Recorremos la propiedad
        foreach ($this->posts as $post)
        {
            if($post->destacado != 0){

                $featured->push($post);
            }
        }

        return $featured;
    }

    // Modificar archivos
    private function modifiFiles ($titulo) : string
    {
          $titulo = mb_strtolower($titulo, 'UTF-8');

          $index = str_replace(' ', '-', $titulo);

          return $index;
    }

    // Encontrar archivos
    private function findJSON (Post $post, $newTitle) : string
    {   
        return resource_path("blog/json/{$post->categoria}/{$newTitle}.json");
    }

    private function findMD (Post $post, $newTitle) : string
    {   
        return resource_path("blog/markdown/{$post->categoria}/{$newTitle}.md");
    }


    // Cargar Index General
    public function index()
    {   
        //Recibimos solo los post destacados
        $posts = $this->getFeaturedPost();

        //Retornamos el objeto filtrado
        return Inertia::render('dashboard', compact('posts'));
    }

    // Cargar un objeto Post
    public function show($id)
    {   
        //BUSCAMOS ID
        $post = $this->posts->findOrFail($id);

        //MODIFICAMOS EL ARCHIVO
        $title = $this->modifiFiles($post->titulo);

        //ENCONTRAMOS LOS ARCHIVOS JSON Y MD
        $routeJson= $this->findJSON($post, $title);
        $routeMd = $this->findMD($post, $title);

        //OBTENEMOS OBJETO JSON
        $jsonContent = file_get_contents($routeJson);
        
        //MAQUETAMOS LOS OBJETOS JSON Y MD
        $index = json_decode($jsonContent, true); 
        $contenido = file_get_contents($routeMd);

        return Inertia::render('post/show',[
            'post'  => $post,
            'index' => $index,
            'contenido' => $contenido
        ]);
    }
}
