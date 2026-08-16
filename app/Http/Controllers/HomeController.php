<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Inertia\Inertia;
use App\Services\FileContentService;
use Barryvdh\DomPDF\Facade\Pdf;
use League\CommonMark\MarkdownConverter;
use League\CommonMark\Environment\Environment;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;
use League\CommonMark\Extension\Table\TableExtension;
use App\Enums\ContentType;
 
use App\Services\MarkdownService;
use Storage;

class HomeController extends Controller
{

    private FileContentService $files;


     public function __construct(FileContentService $files)
    {
        $this->files = $files;
    }



    /**
     * Vista que carga Dashboard Pirncipal con post Destacados
     */
    public function index()
    {
        //Recibimos solo los post destacados
        $posts = Post::featured()->whereNotNull('publish_date')->latest()->limit(6)->get();

        //Retornamos el objeto filtrado
        return Inertia::render('dashboard', compact('posts'));
    }

    /**
     * @param $id
     * Vista de la página individual
     * 
     */
    public function show(int $id)
    {
        $features = Post::featured()->latest()->limit(3)->get();
        $post = Post::with('comments')->findOrFail($id);

        $comments = Comment::where('post_id', $post->id)
        ->whereNull('parent_id')
        ->with(['user', 'replies.user', 'post'])
        ->get();


        $md = Storage::disk('local')->get($post->path(ContentType::Content));
        $json = Storage::disk('local')->get($post->path(ContentType::Index));

        $body = MarkdownService::resolveImages($md , $post);
        $raw = Storage::disk('local')->get($post->path(ContentType::Content));


        $index = json_decode($json, true);

        $artworks = $post->artworks;

        /** Construimos el objeto */
        $content = [
            "post" => $post,
            "index" => $index,
            "body" => $body,
            "comments" => $comments,
            "features" => $features,
            "raw" => $raw,
        ];

        /** Renderizamos */
        return Inertia::render('post/show', compact('content', 'artworks'));
    }

    /**
     * Controlador de archivador 
     */
    public function archivador()
    {
       
        $posts = Post::publish()->get();

        return Inertia::render('post/library', compact('posts'));
    }

    /**
     * Exportacion PDF
     */
    public function pdf(int $id) 
    {   
        $post = Post::findOrFail($id);

        $content = Storage::disk('local')->get($post->path(ContentType::Content));
        $index = Storage::disk('local')->get($post->path(ContentType::Index));

        $tags = $this->files->parseTags($post->tags);

        $env = new Environment();

        $env->addExtension(new CommonMarkCoreExtension());

        $env->addExtension(new TableExtension());

    

        $converter = new MarkdownConverter($env);

        $html = $converter->convert($content)->getContent();

        

        $pdf = Pdf::loadView('post.pdf', [
            'content' => $html,
            'post' => $post,
            'tags' => $tags,
            'index' => $index
            ]);

         return $pdf->download("{$post->title}.pdf");
    }
}
