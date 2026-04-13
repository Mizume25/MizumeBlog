<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

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


    // Cargar Index General
    public function index()
    {   
        //Recibimos solo los post destacados
        $featured = $this->getFeaturedPost();

        //Retornamos el objeto filtrado
        return Inertia::render('dashboard', compact('featured'));
    }
}
