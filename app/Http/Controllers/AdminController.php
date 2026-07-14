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
use Illuminate\Http\UploadedFile;


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
        
        
        $post  = Post::findOrFail($id);

        $data = $request->validated();

        

        unset($data['cover'], $data['cover_card']);
        $data['tags'] = implode(',', $data['tags']);

        /**
         * Actualiza, comprueba y remplaza imagenes
         */
        if ($request->hasFile('cover')) $data['cover'] = $this->replaceImage($request->file('cover'), ImageType::Cover, 'Portada', 'cover', $post);
        if ($request->hasFile('cover_card')) $data['cover_card'] = $this->replaceImage($request->file('cover_card'), ImageType::Card, 'Portada', 'cover_card', $post);


        $post->update($data);

        return redirect()->back()->with('success', 'El Post se  actualizo correctamente');
    }






    /**
     * 
     * Eliminar Post
     * @param $id id del Post
     */
    public function destroy(int $id)
    {

        $post = Post::findOrFail($id);;

        /** Guardamos los valores */
        $path = $this->files->getPath($post->id, $post->title);
        $cover = $post->cover;
        $card = $post->cover_card;


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




        return redirect()->route('post.panel')->with('success', 'Post eliminado');
    }





    /**
     * Funcion para crear un Post
     * @param $request Request Post Store
     */
    public function store(StorePostRequest $request)
    {


        $data = $request->validated();

        unset($data['cover'], $data['cover_card']);

        $data['tags'] = implode(',', $data['tags']);


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



        // 3. Rutas de los archivos
        $path = $this->files->getPath($post->id, $post->title);

        if (!file_exists($path)) {
            mkdir($path, 0755, true); 
        }

        /**
         * Creamos json con plantilla minima
         */
        $jsonContent = json_encode([
            'id'    => $post->id,
            'title' => 'Ejemplo',
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        file_put_contents($path . '/index.json', $jsonContent);


        file_put_contents($path . '/content.md', "## Ejemplo\n");



        return back()->with('Success', "Post creado con exito");
    }

    public function backup()
    {
        $posts     = Post::all()->toArray();
        $users     = User::all()->toArray();
        $coments   = Comment::all()->toArray();

        $fecha = now()->format('Y-m-d');
        $backupPath = public_path('backups');

        if (!file_exists($backupPath)) {
            mkdir($backupPath, 0755, true);
        }

        // Borrar backups fechados antiguos
        foreach (glob($backupPath . '/*_*.json') as $file) {
            unlink($file);
        }

        // Posts
        $postsJson = json_encode($posts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        file_put_contents("{$backupPath}/posts_{$fecha}.json", $postsJson);
        file_put_contents("{$backupPath}/posts.json", $postsJson);

        // Users
        $usersJson = json_encode($users, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        file_put_contents("{$backupPath}/users_{$fecha}.json", $usersJson);
        file_put_contents("{$backupPath}/users.json", $usersJson);

        // Comentarios
        $commentsJson = json_encode($coments, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        file_put_contents("{$backupPath}/comentarios_{$fecha}.json", $commentsJson);
        file_put_contents("{$backupPath}/comentarios.json", $commentsJson);

        return back()->with('success', "Backup creado: {$fecha}");
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


    /**
     * DesMaquetamos Tags
     */
}
