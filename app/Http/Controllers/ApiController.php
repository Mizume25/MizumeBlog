<?php

namespace App\Http\Controllers;

use App\Models\Artwork;
use App\Models\Comment;
use App\Models\Post;
use App\Models\PostImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApiController extends Controller
{
    /** Ruta json que obtiene post no publicados */
    public function upcoming()
    {
        $posts = Post::notPublish()->get();

        return response()->json($posts);
    }


    /** Historial de comentarios */
    public function apiComments(int $post_id)
    {
        $comments = Comment::with(['user', 'replies.user'])
            ->where('user_id', Auth::id())
            ->where('post_id', $post_id)
            ->latest()
            ->paginate(3);

        return response()->json($comments);
    }

    /** Obtener Imagenes Disponibles */
    public function avaliable(int $post_id, int $artwork_id)
    {
        $post = Post::findOrFail($post_id);

        $artwork = $post->artworks()->where('artworks.id', $artwork_id)->firstOrFail();


        $notAvaliable = $post->images()
            ->whereHas(
                'image',
                fn($q) => $q->where('artwork_id', $artwork_id)
            )
            ->pluck('artwork_image_id');


        $avaliable = $artwork->images()->whereNotIn('id', $notAvaliable)->get();

        return response()->json($avaliable);
    }

    /**
     * Funcion para rempalzar imagen
     */

    public function replace(Request $request, int $post_id, int $image_id)
    {
        $request->validate([
            'artwork_image_id' => 'required|integer|exists:artwork_images,id',
        ]);

        $image = PostImage::where('post_id', $post_id)
            ->where('artwork_image_id', $image_id)
            ->firstOrFail();

        $this->authorize('update', $image);

        $image->update([
            'artwork_image_id' => $request->artwork_image_id
        ]);

        return response()->json([
            'message' => 'Imagen remplazada perfectamente',
        ]);
    }
}
