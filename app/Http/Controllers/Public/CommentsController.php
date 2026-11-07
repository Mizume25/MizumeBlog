<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Comments\CommentsRequest;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentsController extends Controller
{
    /**
     * Listado de comentarios principales de un post con sus respuestas
     */
    public function index(string $post_id)
    {
        $comments = Comment::where('post_id', $post_id)
            ->whereNull('parent_id')
            ->with(['user', 'replies.user'])
            ->latest('id')
            ->get();

        return response()->json($comments);
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
    public function store(CommentsRequest $request)
    {


        $request->validated();

        $comment = Comment::create([
            'description' => $request->body,
            'post_id' => $request->post_id,
            'parent_id' => $request->parent_id,
            'user_id'   => Auth::id(),
        ]);

        /** Peticiones fetch (vista works/show) reciben el comentario; Inertia sigue con back() */
        if ($request->expectsJson()) {
            return response()->json($comment->load(['user', 'replies.user']), 201);
        }

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
     * Editar el texto de un comentario o respuesta propio
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'body' => ['required', 'min:5'],
        ]);

        $comment = Comment::where('user_id', Auth::id())->findOrFail($id);

        $comment->update(['description' => $validated['body']]);

        if ($request->expectsJson()) {
            return response()->json($comment->load(['user', 'replies.user']));
        }

        return back()->with('success', 'Comentario editado.');
    }

    /**
     * Borar 1 Comentario Indiviudal
     */
    public function destroy(Request $request, string $id)
    {

        $comment = Comment::where('user_id', Auth::id())->findOrFail($id);



        if ($comment->replies()->exists()) $comment->replies()->delete();


        $comment->delete();

        /** Peticiones fetch reciben JSON; Inertia (settings/history) sigue con back() */
        if ($request->expectsJson()) {
            return response()->json(['message' => 'Comentario eliminado.']);
        }

        return back()->with('success', 'Comentario eliminado.');
    }


    /**
     * Borrar todos los comentarios relativos a un usuario dentro de un post
     */
    public function destroyByPost(string $post_id)
    {

        $query = Comment::where('post_id', $post_id);

        if (Auth::user()->role !== "admin") {
            $query->where('user_id', Auth::id());
        }

        $ids = $query->pluck('id');

        Comment::whereIn('parent_id', $ids)->delete();

        Comment::whereIn('id', $ids)->delete();

        return back()->with('success', 'Comentarios del Post eliminados.');
    }

    /**
     * Borrar todos los comentarios realtivos a un usuario
     */
    public function deleteAll()
    {

        $comments = Comment::where('user_id', Auth::id())->pluck('id');

        Comment::whereIn('parent_id', $comments)->delete();

        Comment::whereIn('id', $comments)->delete();

        return back()->with('success', 'Todos tus comentarios fueron eliminados.');
    }
}
