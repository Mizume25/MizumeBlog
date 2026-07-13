<?php

namespace App\Http\Controllers;


use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ComentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Creamos un Comentario
     * @param $request Request
     */
    public function store(Request $request)
    {
        $request->validate([
            'body' => 'required|min:5',
            'post_id'   => 'required|exists:posts,id',
            'parent_id'   => 'sometimes|nullable|exists:comments,id',
        ]);

        Comment::create([
            'description' => $request->body,
            'post_id' => $request->post_id,
            'parent_id' => $request->parent_id,
            'user_id'   => Auth::id(),
        ]);


        return back()->with('success', '¡Comentario Subido!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Borra Comentarios y Respuestas
     */
    public function destroy(?string $id = null, ?string $post_id = null)
    {
        if ($id !== null) {
            $comment = Comment::where('user_id', Auth::id())->findOrFail($id);

            if ($comment->replies()->exists()) $comment->replies()->delete();


            $comment->delete();

            return back()->with('success', 'Comentario eliminado.');
        }

        if ($post_id != null) {

            $commentIds = Comment::where('post_id', $post_id)
                ->where('user_id', Auth::id())
                ->pluck('id');
    
            Comment::whereIn('parent_id', $commentIds)->delete();

            Comment::whereIn('id', $commentIds)->delete();

            return back()->with('success', 'Comentarios del Post eliminados.');
        }



        if ($id == null && $post_id == null) {
            $comments = Comment::where('user_id', Auth::id())->pluck('id');

            Comment::whereIn('parent_id', $comments)->delete();

            Comment::whereIn('id', $comments)->delete();

            return back()->with('success', 'Todos tus comentarios fueron eliminados.');
        }
    }
}
