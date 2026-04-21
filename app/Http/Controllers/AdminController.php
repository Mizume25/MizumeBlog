<?php

namespace App\Http\Controllers;

use App\Models\Comentario;
use App\Models\Post;
use App\Models\User;
use App\Services\ImageConfigService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{

    private $posts;
    private $users;
    private $coments;

    //Constructor de la Classe
    public function __construct(private ImageConfigService $imgConfig)
    {
        $this->posts = Post::all();
        $this->users = User::all();
        $this->coments = Comentario::all();
    }

    //Getters
    private function getPosts()
    {
        return $this->posts;
    }

    private function getUsers()
    {
        return $this->users;
    }

    private function getComents()
    {
        return $this->coments;
    }


    public function panel()
    {

        $this->getUsers();
        $this->getComents();
        $this->getPosts();


        return Inertia::render('post/MizumeAdmin', [
            'data' => [
                'posts'   => $this->getPosts(),
                'users'   => $this->getUsers(),
                'coments' => $this->getComents(),
            ]
        ]);
    }

    //Vista de Edicion de Post
    public function edit($id)
    {
        $post = Post::findOrFail($id);

        return Inertia::render('post/edit', compact('post'));
    }

    //Vista de actualizacion de Post
    public function update(Request $request, $id)
    {
        $request->validate([
            'titulo'            => 'required|string|max:255',
            'web_title'         => 'nullable|string|max:255',
            'categoria'         => 'required|in:Literatura,AnimeManga,Reflexiones',
            'genero'            => 'required|string',
            'fecha_publicacion' => 'required|date',
            'autor' => 'required |string|max:255',
            'descripcion' => 'nullable|string',
            'publicado'         => 'required|in:0,1',
            'portada'              => 'nullable| string | max:255',
            'card' => 'nullable| string | max:255'
        ]);

        $post  = Post::findOrFail($id);
        $datos = $request->except('portada', 'card');

        // Portada → "P-" + nombre sin extensión en minúsculas
        if ($request->hasFile('portada')) {
            $portada        = $request->file('portada');
            $nombrePortada    = 'P-' . str_replace(' ', '-', strtolower(pathinfo($portada->getClientOriginalName(), PATHINFO_FILENAME)));
            $datos['portada'] = $nombrePortada;
        }

        // Card → nombre completo en minúsculas con su extensión original
        if ($request->hasFile('card')) {
            $card           = $request->file('card');
            $nombreCard    = str_replace(' ', '-', strtolower($card->getClientOriginalName()));
            $datos['card']  = $nombreCard;
        }

        $post->update($datos);

        return redirect()->back()->with('success', 'Post actualizado correctamente');
    }

    //Vista de borrado de Post
    public function destroy($id)
    {

        $post = Post::findOrFail($id);;

        // Formatear título para construir la ruta
        $newTitle = $this->cleanName($post->titulo);

        // Borrar MD y JSON de contenido
        $jsonPath = resource_path("blog/json/{$post->categoria}/{$newTitle}.json");
        $mdPath   = resource_path("blog/markdown/{$post->categoria}/{$newTitle}.md");

        if (file_exists($jsonPath)) unlink($jsonPath);
        if (file_exists($mdPath))   unlink($mdPath);

        // Borrar imagen física
        if ($post->portada) {
            $imgPath = public_path('/IMG/Portada/' . $post->categoria . '/' . $newTitle);
            if (file_exists($imgPath)) unlink($imgPath);
        }

        // Limpiar Formato.json
        $this->imgConfig->delete((int)$id);

        $coments = $post->comentarios();
        //Borramos Contenido Relacionado
        $coments->delete();
        $post->delete();


        return redirect()->route('post.panel')->with('success', 'Post eliminado');
    }

    //Vista de registrar un post 
    public function create()
    {
        return Inertia::render('post/create');
    }

    private function cleanName(string $titulo): string
    {
        $nameClean = mb_strtolower($titulo, 'UTF-8');
        $nameClean = str_replace(
            ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', 'à', 'è', 'ì', 'ò', 'ù'],
            ['a', 'e', 'i', 'o', 'u', 'u', 'n', 'a', 'e', 'i', 'o', 'u'],
            $nameClean
        );
        $nameClean = preg_replace('/[^a-z0-9]+/', '-', $nameClean);
        return $nameClean = trim($nameClean, '-');
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulo'            => 'required|string|max:255',
            'web_title'         => 'nullable|string|max:255',
            'categoria'         => 'required|in:Literatura,AnimeManga,Reflexiones',
            'genero'            => 'required|string',
            'fecha_publicacion' => 'required|date',
            'autor' => 'required |string|max:255',
            'descripcion' => 'nullable|string',
            'publicado'         => 'required|in:0,1',
            'portada'              => 'nullable|string|max:255',
            'card' => 'nullable| string | max:255',
        ]);

        $datos = $request->except('portada', 'card');

        // Portada → "P-" + nombre sin extensión en minúsculas (espacios → guiones)
        if ($request->hasFile('portada')) {
            $portada          = $request->file('portada');
            $datos['portada'] = 'P-' . str_replace(' ', '-', strtolower(pathinfo($portada->getClientOriginalName(), PATHINFO_FILENAME)));
        }

        // Card → nombre completo en minúsculas con su extensión original (espacios → guiones)
        if ($request->hasFile('card')) {
            $card          = $request->file('card');
            $datos['card'] = str_replace(' ', '-', strtolower($card->getClientOriginalName()));
        }

        $post = Post::create($datos);

        // 2. Formatear título → slug
        $newTitle = $this->cleanName($request->titulo);

        // 3. Rutas de los archivos
        $jsonPath = resource_path("blog/json/{$request->categoria}/{$newTitle}.json");
        $mdPath   = resource_path("blog/markdown/{$request->categoria}/{$newTitle}.md");

        // 4. Crear JSON con plantilla mínima
        $jsonContent = json_encode([
            'id'    => $post->id,
            'title' => 'Ejemplo',
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        file_put_contents($jsonPath, $jsonContent);

        // 5. Crear MD con plantilla mínima
        file_put_contents($mdPath, "## Ejemplo\n");

        // 6. Registrar en el JSON de configuración de imagen
        $this->imgConfig->set($post->id, [
            'home_config' => null,
            'article_config' => null,
        ]);

        return back()->with('Success', "Post creado con exito");
    }

    public function backup()
    {
        $posts = Post::all()->toArray();
        $fecha = now()->format('Y-m-d');
        $path  = public_path("backups/posts_{$fecha}.json");

        if (!file_exists(public_path('backups'))) {
            mkdir(public_path('backups'), 0755, true);
        }

        file_put_contents(
            $path,
            json_encode($posts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );

        //Generamos una copia para Fronetend 
        $json = json_encode($posts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        file_put_contents($path, $json);
        file_put_contents(public_path('backups/posts.json'), $json);

        return back()->with('success', "Backup creado: posts_{$fecha}.json");
    }
}
