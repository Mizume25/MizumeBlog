<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Uso: ->middleware('role:editor')  → editor o superior (editor, admin)
     *      ->middleware('role:admin')   → solo admin
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $minimum = UserRole::from($role);

        if (!$request->user()?->hasRoleAtLeast($minimum)) {
            return redirect()->route('forms.request')->with('error', __('access.role_denied'));
        }

        return $next($request);
    }
}
