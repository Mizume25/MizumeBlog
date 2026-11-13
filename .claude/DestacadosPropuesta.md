# Propuesta: Sistema de Destacados

> Estado: **propuesta** (sin implementar). Fecha: 2026-11-13.

## Problema actual

- `posts.featured` es un `boolean` con `default(true)` (migración `create_posts_table`): todo post nace destacado, así que "destacado" no significa nada.
- `Post::featuredWithWorksGroupedByUser()` (lo usa la home) no filtra por `publish_date`: puede mostrar borradores.
- No se sabe quién destacó, cuándo ni por qué.

## Idea general: tres piezas independientes

| Pieza | Quién decide | Qué controla | Dónde se ve |
|---|---|---|---|
| **1. Cupo de destacados** | El usuario, dentro del límite que fija el admin | Qué posts suyos son destacados | Index de su work y home |
| **2. Obras en la home** | Solo el admin | Qué works salen en la home y en qué orden | Home |
| **3. Resaltado en el index** | Automático | Los destacados se ven con otro color | `works/{work}` |

**Objetivo:** un solo sistema de destacados (quién destaca y quién consume el límite), sin saturar la home (el admin controla las obras) y sin limitar los destacados (cada `works/{work}` muestra todos los suyos).

**Ejemplo:** 20 works con 10 posts cada uno. Hay 20 destacados repartidos entre 10 obras. La home solo muestra las obras activadas por el admin (por ejemplo 4), con un máximo de K destacados cada una. El resto sigue destacado y resaltado en el index de su obra.

## Reglas

1. **Cupo por usuario:** `users.featured_quota` vale 1 por defecto. El admin puede subirlo si considera interesante el contenido del usuario.
2. **Quién consume el cupo:** solo los destacados con `featured_by = user_id` (los que se pone el propio autor). Un destacado que pone el admin (`featured_by = admin`) **no** consume el cupo del autor.
3. **Solo se destacan posts publicados** (`publish_date <= now()`).
4. **Permisos (`PostPolicy`):**
   - `feature`: dueño del post, con el post publicado y cupo disponible, o admin.
   - Solo el admin cambia cupos y la curación de la home.
5. **Condición de carrera:** el cupo se comprueba dentro de `DB::transaction` con `lockForUpdate()` sobre la fila del usuario.
6. **Casos límite:**
   - Si el admin baja el cupo por debajo de los destacados actuales, no se quita nada; el usuario no puede destacar más hasta liberar alguno.
   - Un post despublicado o eliminado pierde su destacado.
   - Un usuario baneado (`BannedUser`) pierde sus destacados.

## Modelo de datos

```php
// users
$table->unsignedTinyInteger('featured_quota')->default(1);

// posts: reemplaza el boolean `featured`
$table->timestamp('featured_at')->nullable();
$table->foreignId('featured_by')->nullable()->constrained('users')->nullOnDelete();

// works: curación de la home
$table->timestamp('home_at')->nullable();              // null = no sale en home
$table->unsignedSmallInteger('home_order')->nullable();
// opcional: $table->unsignedTinyInteger('home_posts_limit')->nullable();
```

Migración de datos: los `featured = true` actuales pasan a `featured_at = NULL` (se empieza de cero), salvo que se decida conservarlos.

## Consultas

**Home** (obras activadas, como máximo K destacados publicados por obra):

```php
Work::whereNotNull('home_at')
    ->orderBy('home_order')
    ->with(['posts' => fn ($q) => $q->publishPosts()
        ->whereNotNull('featured_at')
        ->latest('featured_at')
        ->limit(3)])          // Laravel 11+: el limit se aplica por cada work
    ->get();
```

**Index de obra `works/{work}`** (todos los posts, primero los destacados):

```php
$work->posts()->publishPosts()
    ->orderByRaw('featured_at IS NULL')
    ->latest('featured_at')
    ->latest('publish_date');
```

Frontend: si `post.featured_at !== null`, se aplica la clase de resaltado.

## Interfaz

**Workshop (editor):** botón "Destacar" o "Quitar destacado" en cada post, con el contador de cupo (`1/1`).

**Panel admin `/panel/home` (`role:admin`):**
- Lista de works con un interruptor "Mostrar en home", ordenación por arrastre y un contador ("7 destacados · 3 se muestran").
- Gestión de cupos por usuario.

```php
Route::get('/home', [HomeCurationController::class, 'index'])->name('home.index');
Route::patch('/home/works/{work}', [HomeCurationController::class, 'toggle'])->name('home.toggle');
Route::put('/home/order', [HomeCurationController::class, 'reorder'])->name('home.reorder');
Route::patch('/users/{user}/quota', [QuotaController::class, 'update'])->name('users.quota');
```

`{work}` se resuelve por `slug` y `{user}` por `uuid`, así que nunca se expone el id real.

## Futuro (opcional)

- Solicitud de más cupo con `RequestPermission`: el editor la pide y el admin la concede (`granted_by`).
- `featured_until` para que los destacados caduquen.

## Decisiones pendientes

1. ¿El cupo es **global** (recomendado) o **por obra**?
2. ¿K (posts por obra en la home) es un valor **fijo en config** o **configurable por obra** (`home_posts_limit`)?

## Orden de implementación

1. Migración (users, posts y works) y actualización de `fillable` y `casts`.
2. `PostPolicy` (`feature`) y un servicio o acción con la transacción del cupo.
3. Botón "Destacar" en el workshop.
4. Ajustar la consulta de la home y el index de works (y retirar `featuredWithWorksGroupedByUser`).
5. Panel admin de curación de la home y de cupos.
