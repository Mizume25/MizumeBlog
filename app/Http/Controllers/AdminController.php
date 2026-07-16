<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use App\Models\Comment;
use App\Models\User;
use Inertia\Inertia;
use App\Services\ImageType;
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
        $tags = $this->buildTags();

        return Inertia::render('post/create', compact('tags'));
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
        $post = Post::findOrFail($id);

        $tags = $this->buildTags();

        return Inertia::render('post/edit', compact('post', 'tags'));
    }

    /**
     * Función de Actualización de Post
     * @param $request Request Post Update 
     * @param $id Id de Post
     */
    public function update(UpdatePostRequest $request, int $id)
    {

        /** Enotramos Post */
        $post  = Post::findOrFail($id);

        $this->authorize('update', $post);

        

        /** Validamos peticion */
        $data = $request->validated();


        /** Exceptaumos trato de card y cover */
        unset($data['cover'], $data['cover_card'], $data['content']);


        /*** Unimos tags */
        $data['tags'] = implode(',', $data['tags']);


        if ($request->hasFile('content')) {
            $file    = $request->file('content');
            $content = file_get_contents($file->getRealPath());

            if (!MarkdownService::hasHeading($content)) return back()->with('error', 'El archivo MD no es valido');
        } else {

            $content = MarkdownService::generate();
        }

        $titles = MarkdownService::extract($content);
        $index  = json_encode($titles);
        $data['content'] = $content;



        /**
         * Actualiza, comprueba y remplaza imagenes
         */
        if ($request->hasFile('cover')) $data['cover'] = $this->replaceImage($request->file('cover'), ImageType::Cover, 'Portada', 'cover', $post);
        if ($request->hasFile('cover_card')) $data['cover_card'] = $this->replaceImage($request->file('cover_card'), ImageType::Card, 'Portada', 'cover_card', $post);

        $post->update($data);

        $path = $this->files->getPath($post->id, $post->title);


        if (!file_exists($path)) mkdir($path, 0755, true);

        file_put_contents($path . '/index.json', $index);
        file_put_contents($path . '/content.md', $content);




        return redirect()->back()->with('success', 'El Post se actualizo correctamente');
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

        /** Guardamos los valores */
        $path = $this->files->getPath($post->id, $post->title);
        $cover = $post->cover;
        $card = $post->cover_card;
        $folder = basename($path);


        /*** Eliminamos todos los comentarios Asociados */
        Comment::where('post_id', $post->id)->whereNotNull('parent_id')->delete();
        Comment::where('post_id', $post->id)->whereNull('parent_id')->delete();



        $post->delete();

        /***
         * Eliminamos json md imagen y config img en ese orden
         */
        if (file_exists($path . '/' . 'index.json')) unlink($path . '/' . 'index.json');
        if (file_exists($path . '/' . 'content.md')) unlink($path . '/' . 'content.md');
        if ($cover && file_exists(public_path('IMG/Portada/' . $cover))) unlink(public_path('IMG/Portada/' .  $cover));
        if ($card && file_exists(public_path('IMG/Cards/' . $card))) unlink(public_path('IMG/Cards/' . $card));

        Storage::disk('public')->deleteDirectory('IMG/' . $folder);
        Storage::disk('local')->deleteDirectory('blog/' . $folder);





        return redirect()->route('post.panel')->with('success', 'Post eliminado');
    }





    /**
     * Funcion para crear un Post
     * @param $request Request Post Store
     */
    public function store(StorePostRequest $request)
    {
        $this->authorize('create', Post::class);

        $data = $request->validated();

        unset($data['cover'], $data['cover_card'], $data['content']);



        if ($request->hasFile('content')) {
            $file    = $request->file('content');
            $content = file_get_contents($file->getRealPath());



            if (!MarkdownService::hasHeading($content)) return back()->with('error', 'El archivo MD no es valido');
        } else {

            $content = MarkdownService::generate();
        }



        $titles = MarkdownService::extract($content);
        $index  = json_encode($titles);

        $data['tags'] = implode(',', $data['tags']);
        $data['content'] = $content;

        if ($request->hasFile('cover')) {
            $cover = $request->file('cover');

            $name = $this->replaceImage($cover, ImageType::Cover, 'Portada', null, null, $request->cover);

            $data['cover'] = $name;
        }

        if ($request->hasFile('cover_card')) {
            $cover = $request->file('cover_card');

            $name = $this->replaceImage($cover, ImageType::Cover, 'Cards', null, null, $request->cover_card);

            $data['cover_card'] = $name;
        }


        $post = Post::create($data);



        $path = $this->files->getPath($post->id, $post->title);
        $images = basename($path);
        Storage::disk('public')->makeDirectory('IMG/' . $images); 

        if (!file_exists($path)) mkdir($path, 0755, true);

        file_put_contents($path . '/index.json', $index);
        file_put_contents($path . '/content.md', $content);

        return back()->with('success', "Post creado con exito");
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


    /***
     * Maquetar Etiquetas
     */
    private function buildTags()
    {
        $items = Post::tags();
        $tags = collect($items);

        $tags = collect($items)
            ->flatMap(fn($item) => explode(',', $item))
            ->map(fn($g) => trim($g))
            ->filter()
            ->unique()
            ->values()
            ->all();

        return $tags;
    }


    /** generateIndex */
}
