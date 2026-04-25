<?php

namespace App\Http\Controllers;

use App\Models\Comentario;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
    private function getFeaturedPost()
    {
        $featured = collect();
        //Recorremos la propiedad
        foreach ($this->posts as $post) {
            if ($post->destacado != 0) {
                if ($post->publicado) {
                    $featured->push($post);
                }
            }
        }

        return $featured;
    }

    // Modificar archivos
    private function modifiFiles($titulo): string
    {
        $titulo = mb_strtolower($titulo, 'UTF-8');
        $titulo = str_replace(
            ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', 'à', 'è', 'ì', 'ò', 'ù'],
            ['a', 'e', 'i', 'o', 'u', 'u', 'n', 'a', 'e', 'i', 'o', 'u'],
            $titulo
        );

        $index = preg_replace('/[^a-z0-9]+/', '-', $titulo);
        $index = trim($index, '-');

        return $index;
    }

    // Encontrar archivos
    private function findJSON(Post $post, $newTitle): string
    {
        return resource_path("blog/json/{$post->categoria}/{$newTitle}.json");
    }

    private function findMD(Post $post, $newTitle): string
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
        $routeJson = $this->findJSON($post, $title);
        $routeMd = $this->findMD($post, $title);

        //OBTENEMOS OBJETO JSON
        $jsonContent = file_get_contents($routeJson);

        //MAQUETAMOS LOS OBJETOS JSON Y MD
        $index = json_decode($jsonContent, true);
        $contenido = file_get_contents($routeMd);

        //Comentarios sin respuesta 
        $coments = Comentario::with(['user', 'replies.user'])->get();


        //Cargamos usuarios
        $userIds = Comentario::where('post_id', $id)
        ->pluck('user_id')
        ->unique();

        $users = User::whereIn('id', $userIds)->get();

        return Inertia::render('post/show', [
            'post'  => $post,
            'index' => $index,
            'contenido' => $contenido,
            'coments'  => $coments,
            'users' => $users
            
        ]);
    }


    public function store(Request $request)
    {
        // 1. Validar los datos (Muy importante por seguridad)
        $request->validate([
            'body' => 'required|min:5',
            'post_id'   => 'required|exists:posts,id',
            'parent_id'   => 'sometimes|nullable|exists:comentarios,id',
        ]);

        // 2. Insertar en la base de datos
        DB::table('comentarios')->insert([
            'descripcion' => $request->input('body'),
            'fecha' => now(),
            'post_id'   => $request->input('post_id'),
            'user_id'   => Auth::id(),
            'parent_id'   => $request->input('parent_id'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 3. Redirigir o devolver respuesta
        return back()->with('success', '¡Comentario Subido!');
    }

    public function destroy($id)
    {
        // 1. Buscar el comentario
        $comentario = Comentario::findOrFail($id);
        
        
        // 2. Verificar si existe y si pertenece al usuario autenticado
        if (!$comentario || ($comentario->user_id !== Auth::id() && Auth::user()->role !== 'admin')) {
            return back()->with('error', 'No tienes permiso para borrar esto.');
        }

        if(!$comentario->parent_id){
            $replys = Comentario::where('parent_id' , $id);
            $replys->delete();
        }

        $comentario->delete();

        return back()->with('success', 'Comentario eliminado.');
    }

    public function removeReply($id) {
        $comentario = Comentario::where('id', '=', $id);

        $comentario->delete();

        return back()->with('success', 'Comentario eliminado.');
    }

    public function archivador()
    {
        $posts = $this->getFeaturedPost()->toArray();

        return Inertia::render('post/archivador', compact('posts'));
    }
}
