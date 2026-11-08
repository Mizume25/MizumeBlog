<?php

namespace App\Http\Controllers;

use App\Enums\ArticleType;
use App\Filters\AuthorFilter;
use App\Http\Requests\Filters\AuthorFilterRequest;
use App\Models\Author;
use App\Services\MarkdownService;
use Inertia\Inertia;

class AuthorController extends Controller
{

    private MarkdownService $markdown;


    public function __construct(MarkdownService $markdown)
    {
        $this->markdown = $markdown;
    }
    /**
     * Indice de Authores
     */
    public function index(AuthorFilterRequest $request)
    {

        $filters = $request->validated();

        $filter = new AuthorFilter($filters);


        $paginated = $filter->apply(Author::query())->paginate(6)->withQueryString();

        $active = array_filter($filters, fn($v) => $v !== null && $v !== '');

        // now() en vez de flash() para que el mensaje no sobreviva a la siguiente petición
        if (!empty($active)) {
            session()->now('success', $this->message($active, $paginated->total()));
        }

        return Inertia::render('authors/index', [
            'paginated' => $paginated,
            'filters'   => (object) $filters,
        ]);
    }

    public function show(Author $author)
    {
        $post = $author->article()->publishPosts()->with('user:id,uuid,name')->first();
        
        if (empty($post)) {
            $name = $author->display_name;

            $msg = __('author.exceptions.withOutPost',['name' => $name]);

            return back()->with('error', $msg);
        }


        return Inertia::render('authors/show', [
            'author' => $author,
            'post' => $post,
            'build' => fn() => $this->markdown->build($post, ArticleType::Author),
        ]);
    }

    private function message(array $filters, int $total): string
    {
        $parts = [];

        foreach ($filters as $k => $v) {
            $parts[] = __("filters.authors.messages.{$k}") . ": {$v}";
        }

        return trans_choice('filters.authors.applied', $total, [
            'filters' => implode(', ', $parts),
            'total'   => $total,
        ]);
    }
}
