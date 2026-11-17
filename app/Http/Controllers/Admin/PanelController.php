<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ArticleType;
use App\Enums\PostType;
use App\Filters\PostFilter;
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

        /** Posts del usuario filtrados por título (?search=) y estado (?status=) */
        $filter = new PostFilter($filters);

        $query = $this->content()
            ->with(['works.tags', 'author', 'media', 'comments'])
            ->latest();

        $filter->applyTitle($query);
        $filter->applyPostStatus($query);

        $paginated = $query->paginate(8)->withQueryString();

       
        $active = array_filter($filters, fn($v) => filled($v));

        // now() en vez de flash() para que el mensaje no sobreviva a la siguiente petición
        if (!empty($active)) {
            [$type, $text] = $this->message($active, $paginated->total());
            session()->now($type, $text);
        }

        return Inertia::render('panel/workshop/posts', [
            ...$this->context(),
            'paginated' => $paginated,
            'stats'     => fn() => $this->stats(),
            'filter'    => (object) $filters,
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

    /**
     * Mensaje de filtros aplicados: success si hay resultados, error si no.
     *
     * @return array{0: 'success'|'error', 1: string}
     */
    private function message(array $filters, int $total): array
    {
        $parts = [];

        foreach ($filters as $k => $v) {
            $value = match ($k) {
                'status' => __("filters.posts.statuses.{$v}"),
                default  => $v,
            };

            $parts[] = __("filters.posts.messages.{$k}") . ": {$value}";
        }

        $filters = implode(' · ', $parts);

        return $total > 0
            ? ['success', trans_choice('filters.posts.applied.success', $total, ['filters' => $filters, 'total' => $total])]
            : ['error',   __('filters.posts.applied.error', ['filters' => $filters])];
    }
}
