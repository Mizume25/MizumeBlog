<?php

namespace App\Http\Controllers\Public;

use App\Enums\ArticleType;
use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Work;
use App\Services\MarkdownService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Páginas de un post dentro del contexto de un work.
 *
 * Todas comparten el layout persistente WorkShowLayout (card del work, pestañas, aside),
 * por eso todas reciben `work` y `post`. Cada página añade solo los datos de SU entidad:
 * posts → maquetación del markdown · comments → hilo de comentarios · reports → (pendiente)
 */
class WorkPostController extends Controller
{
    public function __construct(private MarkdownService $markdown) {}

    /**
     * Pestaña de publicación: contenido maquetado del post
     */
    public function show(Work $work, Post $post): Response
    {
        return Inertia::render('works/show/post', [
            ...$this->context($work, $post),
            'build' => fn() => $this->markdown->build($post, ArticleType::Work),
        ]);
    }

    /**
     * Pestaña de comentarios: entidad independiente, se recarga sola con `only: ['comments']`
     * Los invitados no reciben comentarios (la vista les pide registrarse)
     */
    public function comments(Work $work, Post $post): Response
    {
        return Inertia::render('works/show/comments', [
            ...$this->context($work, $post),
            'comments' => fn() => Auth::check() ? Comment::threadOf($post->id)->get() : [],
        ]);
    }

    /**
     * Pestaña de reportes (pendiente de implementar)
     */
    public function reports(Work $work, Post $post): Response
    {
        return Inertia::render('works/show/reports', $this->context($work, $post));
    }

    /**
     * Props que necesita el layout: el work y el post abierto.
     * El post debe pertenecer al work y estar publicado.
     */
    private function context(Work $work, Post $post): array
    {
        abort_unless(
            $work->posts()->publishPosts()->whereKey($post->id)->exists(),
            404
        );

        $work->load('authors');
        $post->load('user:id,uuid,name');

        return [
            'work' => $work,
            'post' => $post,
        ];
    }
}
