<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ArticleType;
use App\Enums\PostType;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PanelController extends Controller
{
    /**
     * Area de trabajo - Crear - Editar - Borrar y Subir Archivos
     */
    public function workshop()
    {
        $user = Auth::user();



        $posts = $user->posts()
        ->where('type', PostType::Article)
        ->where('article_type', ArticleType::Work)
        ->with(['works.tags', 'author', 'media', 'comments'])
        ->latest()
        ->get();



        $data = [
            'user' => $user,
            'posts' => $posts
        ];


        return Inertia::render('panel/workshop', compact('data'));
    }
}
