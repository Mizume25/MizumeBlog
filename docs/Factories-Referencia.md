# MizumeBlog — Referencia de Factories

> Explicación de cada función de cada factory en `database/factories/`, documentada contra el **código actual** (commit `a0d17db`). El código fuente propuesto para cada uno está en [`Factories.md`](Factories.md).

---

## Índice

| Factory | Modelo | Estado | Funciones |
|---|---|---|---|
| [UserFactory](#userfactory) | `User` | ✅ Implementado | `definition`, `unverified`, `admin`, `editor`, `withGoogle` |
| [PostFactory](#postfactory) | `Post` | ✅ Implementado | `definition`, `policy`, `featured`, `draft`, `ownedBy` |
| [WorkFactory](#workfactory) | `Work` | ✅ Implementado | `definition`, `literatura`, `animeManga` |
| [AuthorFactory](#authorfactory) | `Author` | ✅ Implementado | `definition`, `pseudonymous` |
| [TagFactory](#tagfactory) | `Tag` | ✅ Implementado | `definition` |
| [CommentFactory](#commentfactory) | `Comment` | ✅ Implementado | `definition`, `replyTo` |
| [RequestPermissionFactory](#requestpermissionfactory) | `RequestPermission` | ✅ Implementado | `definition`, `accepted`, `denied`, `used`, `expired`, `windowClosed`, `stale` |
| [ReportFactory](#reportfactory) | `Report` | ✅ Implementado | `definition`, `resolved`, `rejected`, `forPost`, `forMedia` |
| [BannedUserFactory](#banneduserfactory) | `BannedUser` | ✅ Implementado | `definition`, `forUser`, `ipv6` |
| [ViolationLogFactory](#violationlogfactory) | `ViolationLog` | ✅ Implementado | `definition`, `withoutPost`, `old` |
| [PostImageFactory](#postimagefactory) | `PostImage` | ⚠️ **Vacío** | `definition` (sin campos) |
| [ClaimFactory](#claimfactory) | `Claim` | ⚠️ **Vacío** | `definition` (sin campos) |

---

## Conceptos básicos

| Concepto | Qué es | Ejemplo |
|---|---|---|
| `definition()` | Estado por defecto: los valores que recibe cada columna si no se indica otra cosa. | `User::factory()->create()` |
| **State** (`admin()`, `draft()`…) | Método que **sobrescribe** parte de `definition()`. Se pueden encadenar. | `Post::factory()->policy()->draft()->create()` |
| `afterCreating()` | Código que se ejecuta **después** de insertar la fila. Se usa para pivotes (`attach`). Solo funciona con `create()`, no con `make()`. | `Report::factory()->forPost()->create()` |
| `Model::factory()` como valor | Crea el modelo relacionado y guarda su `id`. Si se le pasa un modelo existente con `for()`, se reutiliza. | `'user_id' => User::factory()` |
| `make()` vs `create()` | `make()` instancia sin guardar; `create()` inserta en BD. | `Post::factory()->make()` |
| Unguarded | Los factories ignoran `$fillable`, así que pueden asignar `role`, `status`, `resolved_by`, etc. | — |

---

## UserFactory

Genera usuarios para la tabla `users`. Por defecto crea un usuario con rol **User**, email verificado y contraseña `password`.

### `definition()`

| Campo | Valor generado | Nota |
|---|---|---|
| `name` | `fake()->name()` | Nombre completo aleatorio |
| `email` | `fake()->unique()->safeEmail()` | Único, dominio seguro (`example.*`) |
| `email_verified_at` | `now()` | Verificado por defecto |
| `password` | `Hash::make('password')` | Se hashea **una sola vez** y se reutiliza (`static::$password`) para acelerar |
| `role` | `UserRole::User` | Enum |
| `google_id` | `null` | — |
| `avatar` | `null` | — |
| `remember_token` | `Str::random(10)` | — |
| `uuid` | *(no se define)* | Lo genera el hook `creating` del modelo |

### States

| Función | Parámetros | Qué cambia | Para qué sirve |
|---|---|---|---|
| `unverified()` | — | `email_verified_at = null` | Probar el flujo de `MustVerifyEmail` y rutas con middleware `verified` |
| `admin()` | — | `role = Admin` | Crear administradores (resolver reportes, banear, conceder permisos) |
| `editor()` | — | `role = Editor` | Crear autores de posts / solicitantes de permisos |
| `withGoogle()` | — | `google_id` = 20 dígitos únicos, `avatar` = URL de imagen | Simular usuarios registrados por OAuth de Google |

```php
User::factory()->admin()->create();
User::factory()->editor()->unverified()->create();
User::factory(10)->withGoogle()->create();
```

---

## PostFactory

Genera posts para la tabla `posts`. Por defecto: **artículo publicado** de un **editor** nuevo.

### `definition()`

| Campo | Valor generado | Nota |
|---|---|---|
| `title` | `fake()->sentence(4)` sin punto final | — |
| `publish_date` | Fecha del último año (`Y-m-d`) | Publicado por defecto |
| `description` | `fake()->paragraph()` | — |
| `featured` | `fake()->boolean(20)` | 20 % de probabilidad de ser destacado |
| `code` | `XX-ABCD12` | 2 letras del título + 4 aleatorias + 2 dígitos únicos, en mayúscula |
| `type` | `PostType::Article` | Enum |
| `user_id` | `User::factory()->editor()` | Crea un editor propietario |

### States

| Función | Parámetros | Qué cambia | Para qué sirve |
|---|---|---|---|
| `policy()` | — | `type = Policy`, `featured = false` | Páginas de políticas (`scopePolicies()`) |
| `featured()` | — | `featured = true` | Forzar un post destacado |
| `draft()` | — | `publish_date = null` | Borradores sin publicar |
| `ownedBy()` | `User $user` | `user_id = $user->id` | Asignar un propietario concreto (probar `isOwnedBy()`, `scopeOwnedBy()`, policies) |

```php
Post::factory()->ownedBy($editor)->featured()->create();
Post::factory()->policy()->ownedBy($admin)->create();
Post::factory(5)->draft()->create();
```

---

## WorkFactory

Genera obras para la tabla `works`. El `medium` siempre es **coherente con la `category`**.

### Constante `MEDIUMS_BY_CATEGORY`

| Categoría | Medios permitidos |
|---|---|
| `literatura` | `Libro`, `Poema`, `Novela`, `NovelaLigera` |
| `animemanga` | `Anime`, `Manga`, `Pelicula` |

### `definition()`

| Campo | Valor generado | Nota |
|---|---|---|
| `title` | `fake()->sentence(3)` sin punto final | — |
| `abbreviation` | Iniciales del título en mayúscula | `"Lorem ipsum dolor"` → `LID` |
| `category` | `WorkCategory` aleatoria | Enum |
| `publish_date` | `fake()->date()` | — |
| `sinopsi` | 2 párrafos | — |
| `medium` | `WorkMedium` válido para la `category` elegida | Usa `MEDIUMS_BY_CATEGORY` |

### States

| Función | Parámetros | Qué cambia | Para qué sirve |
|---|---|---|---|
| `literatura()` | — | `category = Literatura` + medio literario | Probar `scopeOfCategory()` / filtros de literatura |
| `animeManga()` | — | `category = AnimeManga` + medio audiovisual | Probar filtros de anime/manga |

```php
Work::factory()->literatura()
    ->hasAttached(Author::factory(), [], 'authors')
    ->hasAttached(Tag::factory()->count(3), [], 'tags')
    ->create();
```

---

## AuthorFactory

Genera autores para la tabla `authors`.

### `definition()`

| Campo | Valor generado | Nota |
|---|---|---|
| `name` | `fake()->firstName()` | — |
| `last_name` | `fake()->lastName()` | — |
| `pseudonym` | `null` | `displayName` devuelve `"name last_name"` |
| `birth_year` | `fake()->year()` | La columna es `string`, no `date` |
| `description` | `fake()->text(200)` | Columna `string` (máx. 255) |

### States

| Función | Parámetros | Qué cambia | Para qué sirve |
|---|---|---|---|
| `pseudonymous()` | — | `name` y `last_name = null`, `pseudonym` único | Autores conocidos solo por seudónimo; `displayName` devuelve el seudónimo |

```php
Author::factory()->pseudonymous()->create();
```

---

## TagFactory

Genera etiquetas para la tabla `tags`. Requiere el trait `HasFactory` en `Tag`.

### `definition()`

| Campo | Valor generado | Nota |
|---|---|---|
| `name` | `fake()->unique()->word()` | Palabra única en minúscula, compatible con `findOrCreateNormalized()` |

*No tiene states.*

> ⚠️ `unique()->word()` tiene un vocabulario limitado: con cientos de tags puede lanzar `OverflowException`.

---

## CommentFactory

Genera comentarios para la tabla `comments`. Por defecto: **comentario raíz** (sin padre).

### `definition()`

| Campo | Valor generado | Nota |
|---|---|---|
| `description` | `fake()->paragraph()` | — |
| `publish_date` | Fecha de los últimos 6 meses | — |
| `user_id` | `User::factory()` | Usuario normal |
| `post_id` | `Post::factory()` | Crea un post (y su editor) |
| `parent_id` | `null` | Comentario raíz → `reply()` devuelve `false` |

### States

| Función | Parámetros | Qué cambia | Para qué sirve |
|---|---|---|---|
| `replyTo()` | `Comment $parent` | `parent_id = $parent->id`, `post_id = $parent->post_id` | Crear respuestas. Hereda el post del padre para que el hilo sea coherente; `reply()` devuelve `true` |

```php
$root = Comment::factory()->for($post)->create();
Comment::factory(3)->replyTo($root)->create();
```

---

## RequestPermissionFactory

Genera solicitudes de permiso para `requests_permissions`. Los states reproducen cada estado del enum `PermissionStatus` y las transiciones del modelo.

### `definition()`

| Campo | Valor generado | Nota |
|---|---|---|
| `message` | `fake()->sentence(12)` | — |
| `status` | `PermissionStatus::Pending` | El hook `creating` haría lo mismo |
| `requested_at` | `now()` | — |
| `granted_at` | `null` | — |
| `access_expires_at` | `null` | — |
| `granted_by` | `User::factory()->admin()` | ⚠️ Se rellena siempre porque la columna es **NOT NULL** en la migración |
| `user_id` | `User::factory()->editor()` | Solicitante |
| `post_id` | `Post::factory()` | Post sobre el que se pide permiso |

### States

| Función | `status` | Fechas | `isActive()` | Equivale a… |
|---|---|---|---|---|
| *(definition)* | `Pending` | `requested_at = now` | `false` | Solicitud recién creada |
| `accepted()` | `Accepted` | `granted_at = now`, `access_expires_at = +24h` | `true` | `accept($admin)` |
| `denied()` | `Denied` | `granted_at = now` | `false` | `deny($admin)` |
| `used()` | `Used` | Igual que `accepted()` (encadena `accepted()`) | `true` | `accept()` + `markUsed()` |
| `expired()` | `Expired` | `requested_at = -8 días` | `false` | `expire()` tras el job de expiración |
| `windowClosed()` | `Accepted` | `granted_at = -2 días`, `access_expires_at = -1 día` | `false` | Aceptada, pero la ventana de 24 h ya pasó sin usarse |
| `stale()` | `Pending` | `requested_at = -8 días` | `false` | Candidata para `scopeStaleForExpiry()` (más de 7 días) |

```php
RequestPermission::factory()->accepted()->for($post)->for($editor)->create();
RequestPermission::factory(3)->stale()->create();   // para probar el job de expiración
```

---

## ReportFactory

Genera reportes para `reports`. Por defecto: **pendiente y sin vincular** a nada.

### `definition()`

| Campo | Valor generado | Nota |
|---|---|---|
| `message` | `fake()->paragraph()` | — |
| `status` | `ReportStatus::Pending` | — |
| `resolved_by` | `null` | — |

### States

| Función | Parámetros | Qué cambia | Para qué sirve |
|---|---|---|---|
| `resolved()` | — | `status = Resolved`, `resolved_by` = admin nuevo | Equivale a `resolve($admin)`; probar `scopeResolved()` |
| `rejected()` | — | `status = Rejected`, `resolved_by` = admin nuevo | Equivale a `reject($admin)` |
| `forPost()` | `?Post $post = null` | *afterCreating*: `posts()->attach()` en `reports_post` | Evita reportes huérfanos. Sin argumento crea un post nuevo |
| `forMedia()` | `array $media` (modelos o ids) | *afterCreating*: `media()->attach()` en `reports_media` | Reportar imágenes concretas. Los media **deben existir** |

```php
Report::factory()->forPost($post)->create();
Report::factory()->resolved()->forPost()->create();
Report::factory()->forMedia([$media1, $media2->id])->create();
```

---

## BannedUserFactory

Genera baneos para `banned_users`.

### `definition()`

| Campo | Valor generado | Nota |
|---|---|---|
| `email` | `fake()->unique()->safeEmail()` | — |
| `ip_address` | `fake()->ipv4()` | NOT NULL en la migración |
| `reason` | `fake()->sentence(10)` | — |
| `banned_by` | `User::factory()->admin()` | Admin que aplica el baneo |

### States

| Función | Parámetros | Qué cambia | Para qué sirve |
|---|---|---|---|
| `forUser()` | `User $user`, `?string $ip = null` | `email = $user->email`; `ip_address = $ip` o la aleatoria | Banear a un usuario existente; `$user->isBanned()` devuelve `true` |
| `ipv6()` | — | `ip_address = fake()->ipv6()` | Probar `scopeForIp()` / `isBanned()` con IPv6 (cabe en el `string` de 255) |

```php
BannedUser::factory()->forUser($user, '10.0.0.5')->create(['banned_by' => $admin->id]);
BannedUser::isBanned('otro@example.com', '10.0.0.5'); // true por IP
```

---

## ViolationLogFactory

Genera registros de infracciones para `violation_logs`.

### Constante `ACTIONS`

| Acción | Significado sugerido |
|---|---|
| `unauthorized_update` | Intento de editar un post ajeno sin permiso |
| `unauthorized_delete` | Intento de borrar un post ajeno |
| `expired_permission_use` | Uso de un permiso con la ventana cerrada |
| `rate_limit_exceeded` | Superó el límite del `RateLimiter` |

> Ajústalas a las acciones que registre realmente `PostPolicy` / `ViolationLog::record()`.

### `definition()`

| Campo | Valor generado | Nota |
|---|---|---|
| `action` | Una de `ACTIONS` | — |
| `attempts_count` | Entre 1 y 5 | — |
| `post_id` | `Post::factory()` | — |
| `user_id` | `User::factory()->editor()` | Infractor |

### States

| Función | Parámetros | Qué cambia | Para qué sirve |
|---|---|---|---|
| `withoutPost()` | — | `post_id = null` | Infracciones no ligadas a un post (la columna es nullable) |
| `old()` | `int $hours = 48` | `created_at` / `updated_at` = hace `$hours` horas | Probar `scopeRecent($hours)`: los registros `old()` quedan fuera |

```php
ViolationLog::factory(3)->for($editor)->create();             // recientes
ViolationLog::factory()->for($editor)->old(72)->create();     // fuera de recent(24)
ViolationLog::recent(24)->forUser($editor)->count();          // 3
```

---

## PostImageFactory

> ⚠️ **Pendiente: el archivo actual tiene `definition()` vacío.** `PostImage::factory()->create()` fallará por columnas NOT NULL (`key`, `post_id`, `media_id`). El código propuesto está en [`Factories.md` → PostImageFactory](Factories.md#postimagefactory).

Funciones de la propuesta:

| Función | Parámetros | Qué hace |
|---|---|---|
| `definition()` | — | `key` = slug único; `post_id` = post nuevo; `media_id` = crea una fila `media` **ligada al mismo post** (`model_type = Post`, `model_id = post_id`), igual que valida `PostImage::attach()` |
| `cover()` | — | `key = 'cover'` |

Requisito previo: `protected $table = 'posts_images';` en el modelo `PostImage`.

---

## ClaimFactory

> ⚠️ **Pendiente: el archivo actual tiene `definition()` vacío.** `Claim::factory()->create()` fallará por columnas NOT NULL (`name`, `email`, `social_proof_url`, `message`). El código propuesto está en [`Factories.md` → ClaimFactory](Factories.md#claimfactory).

Funciones de la propuesta:

| Función | Parámetros | Qué hace | Estado resultante |
|---|---|---|---|
| `definition()` | — | Reclamante externo (`user_id = null`), 2 URLs en `social_proof_url` | `PendingVerification` + token de 24 h (lo pone el hook) |
| `tokenExpired()` | — | *afterCreating*: caducidad del token en el pasado | `PendingVerification`; `verifyEmail()` → `false` |
| `fromUser()` | `?User $user = null` | Asigna `user_id`, `name` y `email` del usuario | `UnderReview` (el hook se salta la verificación si el email está verificado) |
| `underReview()` | — | `email_verified_at = now`; limpia el token | `UnderReview` |
| `approved()` | `?string $notes = null` | `reviewed_by` = admin, `reviewed_at`, `resolution_notes`; limpia el token | `Approved` |
| `rejected()` | `?string $notes = null` | Igual que `approved()` | `Rejected` |
| `forPost()` | `?Post $post = null` | *afterCreating*: `posts()->attach()` en `claims_post` | Evita reclamaciones huérfanas |
| `resolvedAs()` *(privada)* | `ClaimStatus`, `?string` | Lógica común de `approved()` / `rejected()` | — |
| `clearToken()` *(privada)* | `Claim $claim` | Pone `verification_token` y su caducidad a `null` con `saveQuietly()` | — |

---

## Matriz de dependencias

Qué otros modelos crea cada factory si no le pasas uno existente (usa `for()` u `ownedBy()` para reutilizar y evitar filas de más):

| Factory | Crea automáticamente |
|---|---|
| `UserFactory` | — |
| `PostFactory` | 1 `User` (editor) |
| `WorkFactory` | — |
| `AuthorFactory` | — |
| `TagFactory` | — |
| `CommentFactory` | 1 `User` + 1 `Post` (→ +1 editor) |
| `RequestPermissionFactory` | 1 admin + 1 editor + 1 `Post` (→ +1 editor) |
| `ReportFactory` | — (`resolved`/`rejected`: 1 admin; `forPost()`: 1 `Post`) |
| `BannedUserFactory` | 1 admin |
| `ViolationLogFactory` | 1 editor + 1 `Post` (→ +1 editor) |
| `PostImageFactory` *(propuesta)* | 1 `Post` + 1 `Media` |
| `ClaimFactory` *(propuesta)* | — (`fromUser()`: 1 `User`; `approved`/`rejected`: 1 admin; `forPost()`: 1 `Post`) |

```php
// ❌ Crea 3 posts y 6 usuarios de más
RequestPermission::factory(3)->create();

// ✅ Reutiliza los existentes
RequestPermission::factory(3)->for($post)->for($editor)->create(['granted_by' => $admin->id]);
```
