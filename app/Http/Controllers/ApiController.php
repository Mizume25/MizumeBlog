<?php

namespace App\Http\Controllers;

use App\DTO\ArticleConfig;
use App\DTO\Config;
use App\Models\Comment;
use App\Models\Post;
use App\Models\PostImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\MarkdownService;
use App\Enums\ContentType;
use App\Enums\PositionType;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use ValueError;

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


    /**
     * Funcion para asociar imagenes
     */
    public function associate(Request $request, int $post_id, int $artwork_image_id)
    {
        $request->validate([
            'key' => 'required|string|min:2|max:50',
        ]);

        $post = Post::findOrFail($post_id);

        if (!MarkdownService::keyExistsInPost($request->key, $post)) {
            return response()->json(['message' => 'Esa clave no existe en el markdown de este post.'], 422);
        }

        PostImage::create([
            'post_id' => $post->id,
            'artwork_image_id' => $artwork_image_id,
            'key' => $request->key,
        ]);

        return response()->json(['message' => 'Imagen asociada correctamente']);
    }


    /**
     * Asociar o Desasociar works
     */
    public function symlink(Request $request, int $post_id)
    {
        $request->validate([
            'works' => ['nullable', 'array'],
            'works.*.id' => ['required', 'integer', 'exists:artworks,id'],
        ]);

        $post = Post::findOrFail($post_id);
        $this->authorize('update', $post);

        $ids = collect($request->works ?? [])->pluck('id')->all();

        $post->artworks()->sync($ids);

        return response()->json(['message' => 'Asociaciones de post actualizadas']);
    }


    /** Funcion para obtener keys pendientes */
    public static function pendingKeys(int $post_id)
    {
        $post = Post::findOrFail($post_id);

        if (!$post->artworks()->exists()) return response()->json(['message' => 'Debe Asociarse aun Artwork'], 422);

        $content = Storage::disk('local')->get($post->path(ContentType::Content));

        if ($content == null) return response()->json(['message' => 'Debe tener contenido'], 422);

        $pendingkeys = MarkdownService::syncKeys($content, $post, true);

        if (count($pendingkeys) == 0) return response()->json(['message' => 'No hay keys pendientes'], 422);

        return response()->json($pendingkeys);
    }

    public function associateBulk(Request $request, int $post_id)
    {
        $request->validate([
            'associations' => 'required|array|min:1',
            'associations.*.key' => 'required|string|min:2|max:50',
            'associations.*.artwork_image_id' => 'required|integer|exists:artwork_images,id',
        ]);

        $post = Post::findOrFail($post_id);

        try {
            DB::transaction(function () use ($post, $request) {
                foreach ($request->input('associations') as $item) {
                    $this->createAssociation($post, $item['artwork_image_id'], $item['key']);
                }
            });
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json(['message' => 'Imágenes asociadas correctamente']);
    }


    /** 
     * Funcion para modificar el home position  
     */
    public function updateHomeConfig(Request $request, int $post_id)
    {
        $request->validate([
            'home' => ['required', 'string', 'in:top,center,bottom'],
        ]);

        $post = Post::findOrFail($post_id);

        try {
            $position = PositionType::from($request->home);
        } catch (ValueError) {
            return response()->json(['message' => 'La posición no es valida'], 402);
        }

        $config = $post->config ?? new Config();

        $config->setHome($position);

        $post->config = $config;

        $post->save();

        return response()->json(['message' => 'La posicion home se ha modificado perfectamente']);
    }

    /** 
     * Funcion para modificar el card position  
     */
    public function updateCardConfig(Request $request, int $post_id)
    {
        $request->validate([
            'card' => 'required|string|max:255',
        ]);

        $post = Post::findOrFail($post_id);

        try {
            $position = PositionType::from($request->home);
        } catch (ValueError) {
            return response()->json(['message' => 'La posición no es valida'], 402);
        }

        $config = $post->config ?? new Config();

        $config->setCard($position);

        $post->config = $config;

        $post->save();

        return response()->json(['message' => 'La posicion card se ha modificado perfectamente']);
    }

    /** 
     * Funcion para modificar el card position  
     */
    public function updateArticleConfig(Request $request, int $post_id)
    {
        $request->validate([
            'height' => ['required', 'string'],
            'position' => ['required', 'string', 'in:bottom,top,center'],
        ]);

        try {
            $position = PositionType::from($request->input('position'));
        } catch (\ValueError) {
            return response()->json(['message' => 'La posición no es válida'], 422);
        }

        $article = new ArticleConfig(
            height: $request->input('height'),
            position: $position,
        );

        $post = Post::findOrFail($post_id);
        $config = $post->config ?? new Config();
        $config->setArticle($article);

        $post->config = $config;
        $post->save();

        return response()->json(['message' => 'La configuracion de artículo se ha modificado correctamente']);
    }


    /**
     * Funcion para modificar el color
     */
    public function updateAccentConfig(Request $request, int $post_id)
    {
        $request->validate([
            'accent' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

        $post = Post::findOrFail($post_id);

        $config = $post->config ?? new Config();

        $config->setAccent($request->accent);

        $post->config = $config;

        $post->save();

        return response()->json(['message' => 'El color ha sido modificado perfectamente']);
    }

    /** Lógica compartida de validación + creación, usada por associate() y associateBulk() */
    private function createAssociation(Post $post, int $artworkImageId, string $key): void
    {
        if (!MarkdownService::keyExistsInPost($key, $post)) {
            throw new \InvalidArgumentException("La clave '{$key}' no existe en el markdown de este post.");
        }

        PostImage::create([
            'post_id' => $post->id,
            'artwork_image_id' => $artworkImageId,
            'key' => $key,
        ]);
    }
}
