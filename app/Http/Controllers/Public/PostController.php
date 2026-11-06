<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Services\MarkdownService;
use Storage;

class PostController extends Controller
{
    private MarkdownService $service;

    function __construct(MarkdownService $service)
    {
        $this->service = $service;
    }

    public function build(string $id)
    {
        $post = Post::findOrFail($id);

        $path = $post->user->path($post->code);

        $files =  $this->getFiles($path);


        $sections = $this->service->countSections($files["content"]);


        $index = json_decode($files["index"], true);


        return response()->json([
            'post' => [
                'data' => $post,
                'content' => $files["content"],
                'index' => $index,
                'sections' => $sections
            ]
        ]);
    }


    private function getFiles(string $path)
    {
        $content = Storage::disk('local')->get($path . 'content.md');
        $index = Storage::disk('local')->get($path . 'index.json');

        return [
            'content' => $content,
            'index' => $index,
        ];
    }
}
