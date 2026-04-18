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
}
