<?php

namespace App\Http\Controllers;

use App\Enums\ContentType;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use App\Models\Comment;
use App\Models\User;
use Inertia\Inertia;
use App\Enums\ImageType;
use App\Models\Artwork;
use App\Services\FileContentService;
use App\Services\MarkdownService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{

    private FileContentService $files;

    public function __construct(FileContentService $files)
    {
        $this->files = $files;
    }

    /**
     * View a Fomrulario create
     */
    public function create()
    {
        $tags = $this->files->buildTags();

        $artworks = Artwork::all();

        return Inertia::render('post/create', compact('tags', 'artworks'));
    }

    /**
     * Vista a Panel
     */
    public function panel()
    {
        $posts = Post::orderBy('publish_date', 'desc')->get();
        return Inertia::render('post/MizumeAdmin', [
            'data' => [
                'posts'   => $posts,
                'users'   => User::all(['id', 'name', 'email', 'created_at']),
                'coments' => Comment::all(),
            ]
        ]);
    }

    /**
     * Vista de edición de un post
     */
    public function edit(int $id)
    {
        /** Obtenemos Post con todas las relaciones necesarias en una sola carga */
        $post = Post::with(['artworks.images', 'images.image'])->findOrFail($id);

        /** Construimos tags */
        $tags = $this->files->buildTags();

        $artworks = Artwork::all();

        /** Obras ya relacionadas al post, para el selector */
        $galeries = $post->artworks;

        /** Catálogo de imágenes agrupado por code, para el sidebar de gestión */
        $ids = $post->images()->pluck('artwork_image_id');

        $container = $post->artworks->mapWithKeys(function ($artwork) use ($ids) {
            return [
                $artwork->code => $artwork->images
                    ->whereIn('id', $ids)
                    ->sortBy('num')
                    ->map(fn($img) => [
                        'id' => $img->id,
                        'name' => $img->name,
                        'alt' => $img->alt,
                    ])->values()->toArray(),
            ];
        });

        return Inertia::render('post/edit', compact('post', 'tags', 'container', 'artworks', 'galeries'));
    }

    /**
     * Función de Actualización de Post
     * @param $request Request Post Update 
     * @param $id Id de Post
     */
    public function update(UpdatePostRequest $request, int $id)
    {
        $post = Post::findOrFail($id);
        $this->authorize('update', $post);
        
        $data = $request->validated();

        
        unset($data['cover'], $data['cover_card'], $data['content'], $data['works']);

        $data['tags'] = implode(',', $data['tags']);

        $pendingKeys = [];

        if ($request->hasFile('content')) {
            $file = $request->file('content');
            $content = file_get_contents($file->getRealPath());

            if (!MarkdownService::hasHeading($content)) {
                return back()->with('error', 'El archivo MD no es válido');
            }



            $titles = MarkdownService::extract($content);
            $index = json_encode($titles);

            Storage::disk('local')->put($post->path(ContentType::Content), $content);
            Storage::disk('local')->put($post->path(ContentType::Index), $index);

            $pendingKeys = MarkdownService::syncKeys($content, $post);
        }

        if ($request->hasFile('cover')) $data['cover'] = $this->replaceImage($request->file('cover'), ImageType::Cover, 'Portada', 'cover', $post);
        if ($request->hasFile('cover_card')) $data['cover_card'] = $this->replaceImage($request->file('cover_card'), ImageType::Card, 'Portada', 'cover_card', $post);

        $post->update($data);
        $post->refresh();

        if ($request->has('works')) {
            $this->register($request->input('works', []), $post);
        }

        if (!empty($pendingKeys)) {
            return redirect()->back()->with('warning', 'El post se actualizó, pero hay claves de imagen sin asignar: ' . implode(', ', $pendingKeys));
        }

        return redirect()->back()->with('success', 'El Post se actualizó correctamente');
    }






    /**
     * 
     * Eliminar Post
     * @param $id id del Post
     */
    public function destroy(int $id)
    {
        $post = Post::findOrFail($id);

        $this->authorize('delete', $post);

        $cover = $post->cover;
        $card = $post->cover_card;

        /*** Eliminamos todos los comentarios Asociados */
        Comment::where('post_id', $post->id)->whereNotNull('parent_id')->delete();
        Comment::where('post_id', $post->id)->whereNull('parent_id')->delete();

        /***
         * Eliminamos json md imagen y config img en ese orden
         */
        Storage::disk('local')->delete($post->path(ContentType::Content));
        Storage::disk('local')->delete($post->path(ContentType::Index));


        if ($cover && file_exists(public_path('IMG/Portada/' . $cover))) unlink(public_path('IMG/Portada/' .  $cover));
        if ($card && file_exists(public_path('IMG/Cards/' . $card))) unlink(public_path('IMG/Cards/' . $card));

        $post->delete();

        return redirect()->route('post.panel')->with('success', 'Post eliminado');
    }





    /**
     * Funcion para crear un Post
     * @param $request Request Post Store
     */
    public function store(StorePostRequest $request)
    {
        /**Autorizamos sentencia */
        $this->authorize('create', Post::class);

        /**Validamos datos */
        $data = $request->validated();


        /**Excluimos Datos */
        unset($data['cover'], $data['cover_card'], $data['content'], $data['works']);


        /** Guardamos el contenido, en caso de no haber generamos un ejemplo */
        if ($request->hasFile('content')) {

            $file    = $request->file('content');
            $content = file_get_contents($file->getRealPath());

            if (!MarkdownService::hasHeading($content)) return back()->with('error', 'El archivo MD no es valido');
        } else {

            $content = MarkdownService::generate();
        }

        /** Separamos los tags */
        $data['tags'] = implode(',', $data['tags']);


        /** Guardamos el cover */
        if ($request->hasFile('cover')) {
            $cover = $request->file('cover');

            $name = $this->replaceImage($cover, ImageType::Cover, 'Portada', null, null, $request->cover);

            $data['cover'] = $name;
        }

        /** Guardamos el card */
        if ($request->hasFile('cover_card')) {
            $cover = $request->file('cover_card');

            $name = $this->replaceImage($cover, ImageType::Cover, 'Cards', null, null, $request->cover_card);

            $data['cover_card'] = $name;
        }

        $titles = MarkdownService::extract($content);

        /** Construiremos un indice partiendo de los titulo de la obra */
        $index  = json_encode($titles);

        /**Creamos el post */
        $post = Post::create($data);


        /** Inyectamos contenido */
        Storage::disk('local')->put($post->path(ContentType::Content), $content);
        Storage::disk('local')->put($post->path(ContentType::Index), $index);

        if ($request->has('works')) {
            $this->register($request->input('works', []), $post);
        }

        $pendingKeys = MarkdownService::syncKeys($content, $post);

        if (!empty($pendingKeys)) {
            return back()->with('pendingKeys', $pendingKeys)
                ->with('warning', 'El post se creó, pero hay claves de imagen sin asignar: ' . implode(', ', $pendingKeys));
        }

        return redirect()->route('post.edit', $post->id)->with('success', 'Post Creado con exito');
    }

    public function backup()
    {
        $data = [
            'posts'    => Post::all()->toArray(),
            'users'    => User::all()->makeHidden(['password', 'remember_token'])->toArray(),
            'comments' => Comment::all()->toArray(),
        ];


        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        if ($json == false) return back()->with('error', 'Fallo el generar un backup' . json_last_error_msg());



        $timestamp = now()->format('Y-m-d_His');
        $path = "backups/backup_{$timestamp}.json";

        Storage::disk('local')->put($path, $json);

        /** Sobre escribimos init App */
        Storage::disk('local')->put('init.json', json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

        return back()->with('success', "Backup creado: {$path}");
    }

    /**
     * Procesa el card y la portada
     * @param $post 
     * @param UploadedFile $file
     * @param ImageType $type
     * @param string $folder
     * @param string $field
     */
    private function replaceImage(UploadedFile $file, ImageType $type, string $folder, ?string $field = null, ?Post $post = null, ?string $imgName = null): string
    {
        $img = $post !== null ? $post->{$field} : $imgName;

        $oldPath = public_path("IMG/{$folder}/{$img}");

        if ($img && file_exists($oldPath)) unlink($oldPath);


        $name = $this->files->modifyImages($type, $file);

        $file->move(public_path("IMG/{$folder}"), $name);

        return $name;
    }

    /**
     * Crear Registro
     */
    private function register(array $works, Post $post): void
    {
        $ids = collect($works)->pluck('id')->filter()->all();
        $post->artworks()->sync($ids);
    }
}
