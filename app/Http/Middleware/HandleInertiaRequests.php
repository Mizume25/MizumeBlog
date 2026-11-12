<?php

namespace App\Http\Middleware;

use App\Enums\PostType;
use App\Models\Post;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    private function getLegalityPosts(): array
    {
        return Cache::remember(
            'legality_posts',
            3600,
            fn () => Post::where('type', PostType::Legality)->get(['id', 'title', 'code'])->toArray()
        );
    }

    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name'  => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth'  => [
                'user' => $request->user()?->only([
                    'id',
                    'name',
                    'email',
                    'role',
                    'avatar',
                    'uuid',
                ]),
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'warning' => fn() => $request->session()->get('warning'),
            ],
            'terms' => fn () => $this->getLegalityPosts(),
        ];
    }
}
