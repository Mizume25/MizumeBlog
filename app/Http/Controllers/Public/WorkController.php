<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Filters\WorkFilterRequest;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Tag;
use App\Models\Work;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use App\Filters\WorkFilters;
use App\Http\Requests\Filters\PostFilterRequest;
use App\Models\User;
use Storage;

use function PHPUnit\Framework\isEmpty;

class WorkController extends Controller
{
    /**
     * Lista de Obras 
     */
    public function index(WorkFilterRequest $request)
    {
        $filters = $request->validated();

        $filter = new WorkFilters($filters);

        $paginated = $filter
            ->apply(Work::query()->with('media', 'tags', 'authors'))
            ->paginate(6)
            ->withQueryString();


        $tags = Tag::whereHas('works')->orderBy('name')->get();

        // filled() descarta null, '' y arrays vacíos (tags: [])
        $active = array_filter($filters, fn($v) => filled($v));

        // now() en vez de flash() para que el mensaje no sobreviva a la siguiente petición
        if (!empty($active)) {
            session()->now('success', $this->message($active, $paginated->total(), $tags));
        }

        return Inertia::render('works/index', [
            'paginated' => $paginated,
            'tags'      => $tags,
            'filters'   => (object) $filters,
        ]);
    }

    /**
     * Vista de Work
     */
    public function show(PostFilterRequest $request, Work $work)
    {
        $content = Storage::disk('local')->get('Plantilla.md');

        $paginated = $work->posts()->publishPosts()->with('user:id,uuid,name')->latest('publish_date')->paginate(1)
            ->withQueryString();

        $users = $work->posts()
            ->publishPosts()
            ->with('user:id,uuid,name')
            ->get()
            ->pluck('user')
            ->filter()       
            ->unique('id')    
            ->values();

        return Inertia::render('works/show', compact('work', 'content', 'paginated', 'users'));
    }

    private function message(array $filters, int $total, Collection $tags): string
    {
        $parts = [];

        foreach ($filters as $k => $v) {
           
            $value = match ($k) {
                'category' => __("filters.works.categories.{$v}"),
                'medium'   => __("filters.works.mediums.{$v}"),
                'tags'     => $tags->whereIn('id', array_map('intval', $v))->pluck('name')->implode(', '),
                default    => $v,
            };

            $parts[] = __("filters.works.messages.{$k}") . ": {$value}";
        }

        return trans_choice('filters.works.applied', $total, [
            'filters' => implode(' · ', $parts),
            'total'   => $total,
        ]);
    }
}
