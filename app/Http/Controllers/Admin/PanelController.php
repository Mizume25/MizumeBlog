<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ArticleType;
use App\Enums\PostType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Filters\PostFilterRequest;
use App\Models\Comment;
use App\Models\Report;
use App\Models\RequestPermission;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Area de trabajo - Crear - Editar - Borrar y Subir Archivos
 *
 * Todas las pestañas comparten el layout persistente WorkShopLayout,
 * por eso todas reciben `counts`. Cada página añade solo los datos de SU vista:
 * manage → resumen de actividad · posts / reports / requests → (pendiente)
 */
class PanelController extends Controller
{
    /**
     * Pestaña de administrador: resumen de actividad del usuario
     */
    public function workshop(): Response
    {
        return Inertia::render('panel/workshop/manage', [
            ...$this->context(),
            // Todos los posts: las estadísticas de bloc-info necesitan la lista completa
            'posts' => fn() => $this->content()
                ->with(['works.tags', 'author', 'media', 'comments'])
                ->latest()
                ->get(),
        ]);
    }

    /**
     * Pestaña de publicaciones: posts del usuario paginados, filtrables por título (?search=)
     *
     * Aquí no se busca por usuario: todos los posts son del autenticado.
     * stats y counts NO se filtran: muestran siempre los totales.
     */
    public function posts(PostFilterRequest $request): Response
    {
        $filters = $request->validated();

        return Inertia::render('panel/workshop/posts', [
            ...$this->context(),
            'paginated' => fn() => $this->content()
                ->when($filters['search'] ?? null, fn($q, $v) => $q->searchTitle($v))
                ->with(['works.tags', 'author', 'media', 'comments'])
                ->latest()
                ->paginate(5)
                ->withQueryString(),
            'stats'  => fn() => $this->stats(),
            // (object): con filtros vacíos llega {} y no [] al frontend
            'filter' => (object) $filters,
        ]);
    }

    /**
     * Pestaña de reportes (pendiente de implementar)
     */
    public function reports(): Response
    {
        return Inertia::render('panel/workshop/reports', $this->context());
    }

    /**
     * Pestaña de solicitudes (pendiente de implementar)
     */
    public function requests(): Response
    {
        return Inertia::render('panel/workshop/requests', $this->context());
    }


    /**
     * Query base: artículos de works del usuario autenticado.
     * Devuelve el builder sin ejecutar; cada acción decide get(), paginate() o count().
     */
    private function content(): HasMany
    {
        return Auth::user()->posts()
            ->where('type', PostType::Article)
            ->where('article_type', ArticleType::Work);
    }


    // Estadisiticas de posts
    private function stats(): array
    {
        $today = now()->toDateString();
        $base  = $this->content();

        return [
            'publish'  => (clone $base)->whereNotNull('publish_date')->whereDate('publish_date', '<=', $today)->count(),
            'pending'  => (clone $base)->whereDate('publish_date', '>', $today)->count(),
            'drafts'   => (clone $base)->whereNull('publish_date')->count(),
            'comments' => Comment::whereIn('post_id', $this->content()->select('posts.id'))->count(),
        ];
    }

    /**
     * Props que necesita el layout: un número representativo por pestaña.
     * El usuario no va aquí: ya lo comparte HandleInertiaRequests (auth.user).
     *
     * manage   → pendientes totales (reportes + solicitudes)
     * posts    → artículos de works del usuario
     * reports  → reportes pendientes sobre sus posts
     * requests → solicitudes pendientes sobre sus posts
     */
    private function context(): array
    {
        return [
            'counts' => function () {
                $user = Auth::user();

                $ownPost = fn($q) => $q->where('user_id', $user->id);

                $reports  = Report::pending()->whereHas('posts', $ownPost)->count();
                $requests = RequestPermission::pending()->whereHas('post', $ownPost)->count();

                return [
                    'manage'   => $reports + $requests,
                    'posts'    => $this->content()->count(),
                    'reports'  => $reports,
                    'requests' => $requests,
                ];
            },
        ];
    }
}
