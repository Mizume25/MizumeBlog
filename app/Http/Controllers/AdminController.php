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
            'ruta'           => 'nullable|image|max:2048',
        ]);

        $post = Post::findOrFail($id);
        $datos = $request->except('ruta');

        if ($request->hasFile('ruta')) {

            // Si ya existía una imagen antigua, la borramos del disco para no dejar basura
            if ($post->ruta) {
                FacadesStorage::disk('public')->delete($post->ruta);
            }

            $file = $request->file('ruta');

            $nameClean = str_replace(' ', '-', $request->titulo);
            $ext = $file->getClientOriginalExtension();
            $path = "P-{$nameClean}.{$ext }";

            $dest = "/IMG/Portada/{$request->categoria}";

            $path = $file->storeAs($dest, $path, 'public');

            // Guardamos ese STRING en la columna 'ruta' de la base de datos
            $datos['ruta'] = $path;
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
