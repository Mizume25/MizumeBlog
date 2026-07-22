# Seguridad Laravel + React (Inertia, mismo dominio)

**Contexto asumido:** [Suponiendo] Breeze o Fortify instalado, Eloquent como ORM principal, sesiones stateful (no API tokens Bearer). Si alguno de estos supuestos es falso, varios pasos cambian.

Quedan **fuera** de este documento (los retomamos después): servicios externos (Analytics, Sentry, Cloudflare, etc.).

---

## 0. Estructura de carpetas objetivo

```
app/
  Http/
    Controllers/
      Admin/                <- controladores exclusivos de administración
        DashboardController.php
        UserManagementController.php
      User/                 <- controladores del área autenticada normal
        ProfileController.php
    Middleware/
      EnsureUserIsAdmin.php
      SecurityHeaders.php
    Requests/
      Admin/
        UpdateUserRoleRequest.php
      User/
        UpdateProfileRequest.php
  Policies/
    UserPolicy.php
    PostPolicy.php
  Providers/
    AuthServiceProvider.php
    RouteServiceProvider.php

routes/
  web.php          <- rutas públicas + auth normal
  admin.php         <- rutas exclusivas de admin, registradas con prefix+middleware
  auth.php          <- rutas de Breeze/Fortify (login, registro, etc.)

resources/js/
  Pages/
    Admin/          <- vistas Inertia solo accesibles vía rutas admin
    User/
    Auth/
  Layouts/
    AdminLayout.jsx
    AppLayout.jsx
```

**Regla clave:** un controlador de `Admin/` nunca debería ser alcanzable desde una ruta que no pase por el middleware `admin`. La separación de carpetas es cosmética si no está reforzada por middleware — no confundas organización con seguridad.

---

## Paso 1: Middleware de rol (admin vs user)

No uses `if (auth()->user()->role === 'admin')` disperso dentro de controladores. Centralízalo.

```php
// app/Http/Middleware/EnsureUserIsAdmin.php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || $request->user()->role !== 'admin') {
            abort(403, 'No tienes permisos para acceder a esta sección.');
        }

        return $next($request);
    }
}
```

Registro en `bootstrap/app.php` (Laravel 11+) o `app/Http/Kernel.php` (Laravel 10):

```php
// bootstrap/app.php (Laravel 11)
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
    ]);
})
```

---

## Paso 2: Separación física de rutas admin/user

```php
// routes/admin.php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserManagementController;

Route::middleware(['auth', 'verified', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::patch('/users/{user}/role', [UserManagementController::class, 'updateRole'])->name('users.role.update');
    });
```

Cárgalo en `bootstrap/app.php`:

```php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    then: function () {
        Route::middleware('web')->group(base_path('routes/admin.php'));
    },
)
```

`prefix('admin')` + `middleware admin` en el mismo grupo es intencional: **nunca** definas una ruta admin sin el middleware en la misma declaración de grupo — un futuro `Route::get()` suelto fuera del grupo es el error más común que abre un agujero.

---

## Paso 3: Autorización a nivel de objeto — Policies

El middleware de rol controla "¿puedes entrar a esta sección?". Las Policies controlan "¿puedes tocar _este_ recurso concreto?". Son complementarios, no sustitutos.

```php
// app/Policies/PostPolicy.php
<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Post;

class PostPolicy
{
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id || $user->role === 'admin';
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id || $user->role === 'admin';
    }
}
```

Registro:

```php
// app/Providers/AuthServiceProvider.php
<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\Post;
use App\Policies\PostPolicy;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Post::class => PostPolicy::class,
    ];
}
```

Uso en controlador (evita el bug clásico de "borré el post de otro usuario cambiando el ID en la URL"):

```php
// app/Http/Controllers/User/PostController.php
public function destroy(Post $post)
{
    $this->authorize('delete', $post);

    $post->delete();

    return redirect()->back();
}
```

O directo en la ruta:

```php
Route::delete('/posts/{post}', [PostController::class, 'destroy'])
    ->middleware('can:delete,post');
```

---

## Paso 4: Form Requests — validación + autorización de entrada

No valides con `$request->validate([...])` inline en controladores grandes. Usa clases dedicadas: separan "¿puede hacer esto?" de "¿los datos son válidos?".

```php
// app/Http/Requests/Admin/UpdateUserRoleRequest.php
<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'role' => ['required', Rule::in(['admin', 'editor', 'user'])],
        ];
    }
}
```

```php
// app/Http/Controllers/Admin/UserManagementController.php
use App\Http\Requests\Admin\UpdateUserRoleRequest;

public function updateRole(UpdateUserRoleRequest $request, User $user)
{
    $user->update(['role' => $request->validated('role')]);

    return back();
}
```

---

## Paso 5: Protección de asignación masiva (mass assignment)

```php
// app/Models/User.php
class User extends Authenticatable
{
    protected $fillable = ['name', 'email', 'password'];
    // 'role' NO va aquí — así un $user->update($request->all()) no puede
    // convertir a alguien en admin aunque cuelen el campo en el payload.
}
```

Regla: `$fillable` explícito siempre. Nunca `$guarded = []`. Y nunca `->update($request->all())` — usa `->update($request->validated())` (Paso 4).

---

## Paso 6: CSRF con Inertia (el punto que mencioné antes)

Con Sanctum stateful + Inertia, Laravel ya protege automáticamente las rutas `web` con `VerifyCsrfToken`. **No lo excluyas.** Si te da error 419, el problema casi siempre es esto:

```php
// resources/js/bootstrap.js — asegúrate de que axios manda las cookies
import axios from 'axios';
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;
```

Y en `.env`:

```
SESSION_DOMAIN=tudominio.com
SANCTUM_STATEFUL_DOMAINS=tudominio.com
```

Si sigues teniendo 419 en sesiones largas, es el timeout de sesión expirando (comportamiento correcto), no un bug — no lo "arregles" subiendo `SESSION_LIFETIME` a un valor absurdo.

---

## Paso 7: Rate limiting

```php
// app/Providers/RouteServiceProvider.php o bootstrap/app.php según versión
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

RateLimiter::for('admin-actions', function (Request $request) {
    return Limit::perMinute(30)->by($request->user()?->id ?: $request->ip());
});

RateLimiter::for('login', function (Request $request) {
    return Limit::perMinute(5)->by($request->ip());
});
```

Uso:

```php
Route::middleware(['auth', 'admin', 'throttle:admin-actions'])->group(function () {
    // rutas sensibles de admin
});
```

---

## Paso 8: Cabeceras de seguridad (CSP, X-Frame-Options, etc.)

```php
// app/Http/Middleware/SecurityHeaders.php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set(
            'Content-Security-Policy',
            "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
        );

        return $response;
    }
}
```

Regístralo como middleware global (`web` group) en `bootstrap/app.php`. Nota: `'unsafe-inline'` en `script-src` es un parche temporal por cómo Vite/Inertia inyecta cosas — cuando integres Analytics u otros scripts de terceros (fuera de este documento) tendrás que revisar esta CSP otra vez.

---

## Paso 9: Configuración de sesión y cookies segura

```php
// config/session.php — valores a forzar en producción vía .env
'secure' => env('SESSION_SECURE_COOKIE', true),   // solo HTTPS
'http_only' => true,                               // JS no puede leer la cookie
'same_site' => 'lax',                              // 'strict' si no necesitas navegación cross-site
```

```
# .env producción
SESSION_SECURE_COOKIE=true
APP_DEBUG=false
APP_ENV=production
```

`APP_DEBUG=false` en producción no es opcional: con `true`, cualquier excepción expone stack traces con rutas del servidor y a veces variables de entorno.

---

## Paso 10: Auditoría / logging de acciones sensibles

```php
// app/Http/Controllers/Admin/UserManagementController.php
use Illuminate\Support\Facades\Log;

public function updateRole(UpdateUserRoleRequest $request, User $user)
{
    $oldRole = $user->role;

    $user->update(['role' => $request->validated('role')]);

    Log::channel('security')->info('role_updated', [
        'actor_id' => $request->user()->id,
        'target_id' => $user->id,
        'old_role' => $oldRole,
        'new_role' => $user->role,
        'ip' => $request->ip(),
    ]);

    return back();
}
```

```php
// config/logging.php — añade un canal dedicado
'security' => [
    'driver' => 'daily',
    'path' => storage_path('logs/security.log'),
    'level' => 'info',
    'days' => 90,
],
```

---

## Paso 11: Verificación de permisos también en el front (Inertia)

Esto **no sustituye** al backend — es solo para UX (ocultar botones que igualmente fallarían en el servidor). Comparte el rol vía `HandleInertiaRequests`:

```php
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'auth' => [
            'user' => $request->user()?->only('id', 'name', 'email', 'role'),
        ],
    ]);
}
```

```jsx
// resources/js/Pages/Admin/Dashboard.jsx
import { usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage().props;

    if (auth.user.role !== 'admin') {
        return null; // esto es cosmético, la protección real ya la hizo el middleware del servidor
    }

    return <div>Panel de administración</div>;
}
```

---

## Checklist final

- [x] Middleware `admin` aplicado a **toda** ruta bajo `routes/admin.php`, sin excepciones sueltas
- [ ] Policies registradas para cada modelo con propietario (`Post`, `Comment`, etc.)
- [ ] Todo `update()`/`create()` usa `$request->validated()`, nunca `$request->all()`
- [x] `$fillable` explícito en todos los modelos, `role` fuera de `$fillable`
- [ ] `VerifyCsrfToken` activo, axios con `withCredentials = true`
- [ ] Rate limiting en login y en acciones admin sensibles
- [ ] `SecurityHeaders` middleware activo globalmente
- [ ] `SESSION_SECURE_COOKIE=true`, `APP_DEBUG=false` en producción
- [ ] Canal de log `security` capturando cambios de rol/permisos
- [ ] Verificación de rol en frontend (Inertia) es solo cosmética, no de seguridad

---

## Pendiente para después (fuera de alcance de este documento)

- Integraciones externas (Analytics, Sentry, servicios de terceros)
- Configuración de CORS si en el futuro separas el frontend a otro dominio
- 2FA (Fortify lo trae de fábrica si lo activas)
- WAF / Cloudflare / protección a nivel de infraestructura