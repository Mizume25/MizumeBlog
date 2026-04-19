<?php

namespace App\Http\Controllers;

use App\Models\Comentario;
use App\Models\Post;
use App\Models\User;
use Illuminate\Container\Attributes\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage as FacadesStorage;
use Inertia\Inertia;

class AdminController extends Controller
{

    private $posts;
    private $users;
    private $coments;

    public function __construct()
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

        $post = $this->posts->findOrFail($id);

        //Colecccion de comentarios
        $coments = $post->comentarios();

        //Borramos Contenido Relacionado
        $coments->delete();
        $post->delete();


        return redirect()->route('post.panel')->with('success', 'Post eliminado');
    }
}
