<?php

namespace App\Http\Controllers;

use App\Models\Comentario;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
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
