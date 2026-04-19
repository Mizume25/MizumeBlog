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


    public function __construct(private ImageConfigService $imgConfig)
    {
        $this->posts = Post::all();
        $this->users = User::all();
        $this->coments = Comentario::all();
    }

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

        $users = $this->getUsers();
        $coments = $this->getComents();
        $posts = $this->getPosts();


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
        $post = $this->posts->findOrFail($id);

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
            'ruta'              => 'nullable|image|max:2048',
        ]);

        $post  = Post::findOrFail($id);
        $datos = $request->except('ruta');

        if ($request->hasFile('ruta')) {

            $file = $request->file('ruta');
            $ext  = strtolower($file->getClientOriginalExtension());

            // Limpiar el título
            $nameClean = strtolower($request->titulo);
            $nameClean = str_replace(
                ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', 'à', 'è', 'ì', 'ò', 'ù'],
                ['a', 'e', 'i', 'o', 'u', 'u', 'n', 'a', 'e', 'i', 'o', 'u'],
                $nameClean
            );
            $nameClean = preg_replace('/[^a-z0-9]+/', '-', $nameClean);
            $nameClean = trim($nameClean, '-');

            $filename = "P-{$nameClean}.{$ext}";
            $dest     = public_path("IMG/Portada/{$request->categoria}");
            $newRuta  = "/IMG/Portada/{$request->categoria}/{$filename}";

            // Crear el directorio si no existe
            if (!file_exists($dest)) {
                mkdir($dest, 0755, true);
            }

            // Mover primero la nueva imagen
            $file->move($dest, $filename);

            // Borrar la antigua solo si es diferente a la nueva
            if ($post->ruta && $post->ruta !== $newRuta) {
                $oldPath = public_path($post->ruta);
                if (file_exists($oldPath)) {
                    unlink($oldPath);
                }
            }

            $datos['ruta'] = $newRuta;
        }

        $post->update($datos);

        return redirect()->back()->with('success', 'Post actualizado correctamente');
    }

    //Vista de borrado de Post
    public function destroy($id)
    {

        $post = Post::findOrFail($id);;

        // Formatear título para construir la ruta
        $newTitle = mb_strtolower($post->titulo, 'UTF-8');
        $newTitle = str_replace(' ', '-', $newTitle);

        // Borrar MD y JSON de contenido
        $jsonPath = resource_path("blog/json/{$post->categoria}/{$newTitle}.json");
        $mdPath   = resource_path("blog/markdown/{$post->categoria}/{$newTitle}.md");

        if (file_exists($jsonPath)) unlink($jsonPath);
        if (file_exists($mdPath))   unlink($mdPath);

        // Borrar imagen física
        if ($post->ruta) {
            $imgPath = public_path($post->ruta);
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
            'ruta'              => 'nullable|image|max:2048',
        ]);

        // 1. Crear el post en BD
        $post = Post::create($request->except('ruta'));
        if ($request->hasFile('ruta')) {

            $file = $request->file('ruta');
            $ext  = strtolower($file->getClientOriginalExtension());

            $nameClean = mb_strtolower($request->titulo, 'UTF-8');
            $nameClean = str_replace(
                ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', 'à', 'è', 'ì', 'ò', 'ù'],
                ['a', 'e', 'i', 'o', 'u', 'u', 'n', 'a', 'e', 'i', 'o', 'u'],
                $nameClean
            );
            $nameClean = preg_replace('/[^a-z0-9]+/', '-', $nameClean);
            $nameClean = trim($nameClean, '-');

            $filename = "P-{$nameClean}.{$ext}";
            $dest     = public_path("IMG/Portada/{$request->categoria}");

            if (!file_exists($dest)) {
                mkdir($dest, 0755, true);
            }

            $file->move($dest, $filename);
            $post->update(['ruta' => "/IMG/Portada/{$request->categoria}/{$filename}"]);
        }

        // 2. Formatear título → slug
        $newTitle = mb_strtolower($request->titulo, 'UTF-8');
        $newTitle = str_replace(' ', '-', $newTitle);

        // 3. Rutas de los archivos
        $jsonPath = resource_path("blog/json/{$request->categoria}/{$newTitle}.json");
        $mdPath   = resource_path("blog/markdown/{$request->categoria}/{$newTitle}.md");

        // Crear directorios si no existen
        foreach ([$jsonPath, $mdPath] as $path) {
            $dir = dirname($path);
            if (!file_exists($dir)) {
                mkdir($dir, 0755, true);
            }
        }

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
        $path  = storage_path("backups/posts_{$fecha}.json");

        if (!file_exists(storage_path('backups'))) {
            mkdir(storage_path('backups'), 0755, true);
        }

        file_put_contents(
            $path,
            json_encode($posts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );

        return back()->with('success', "Backup creado: posts_{$fecha}.json");
    }
}
