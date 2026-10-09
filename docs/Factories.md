# MizumeBlog — Factories

> Código para cada archivo de `database/factories/`, construido contra los modelos de `app/Models`, los enums de `app/Enums` y las migraciones **reales** de `database/migrations` (no solo contra `MizumeBlog-Modelos.md`). Donde el código y el documento no coinciden, manda el código y se indica en la sección correspondiente.

---

## Antes de pegar nada: 4 cosas que romperán los factories

> Nota: los factories se ejecutan con `Model::unguarded()`, así que **sí** pueden asignar campos fuera de `$fillable` (`role`, `status`, `granted_by`, `resolved_by`, `reviewed_by`…). Eso es intencionado y no abre ningún hueco en producción.

> Nota extra: `config/media-library.php` sigue con `'media_model' => Spatie\...\Media::class`, no `App\Models\Media::class`. No afecta a los factories (crean `App\Models\Media` directamente), pero sí a `PostImage::attach()` en uso real.

---

## UserFactory

`database/factories/UserFactory.php`

- `uuid` **no** se define: lo genera el hook `creating` del modelo.
- `role` usa el enum; estados `admin()`, `editor()` y `withGoogle()`.

```php
<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'role' => UserRole::User,
            'google_id' => null,
            'avatar' => null,
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => UserRole::Admin,
        ]);
    }

    public function editor(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => UserRole::Editor,
        ]);
    }

    /** Usuario registrado vía Google OAuth. */
    public function withGoogle(): static
    {
        return $this->state(fn (array $attributes) => [
            'google_id' => (string) fake()->unique()->numerify('####################'),
            'avatar' => fake()->imageUrl(200, 200, 'people'),
        ]);
    }
}
```

---

## PostFactory

`database/factories/PostFactory.php`

- Columnas reales tras `modify_fields_posts_table`: `title`, `publish_date` (nullable), `description` (nullable), `featured`, `code` (nullable, único), `type`, `user_id`.
- El propietario por defecto es un **editor**.

```php
<?php

namespace Database\Factories;

use App\Enums\PostType;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(4);

        return [
            'title' => rtrim($title, '.'),
            'publish_date' => fake()->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'description' => fake()->paragraph(),
            'featured' => fake()->boolean(20),
            'code' => strtoupper(Str::substr(Str::slug($title, ''), 0, 2) . '-' . Str::random(4))
                . fake()->unique()->numerify('##'),
            'type' => PostType::Article,
            'user_id' => User::factory()->editor(),
        ];
    }

    public function policy(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => PostType::Policy,
            'featured' => false,
        ]);
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'featured' => true,
        ]);
    }

    /** Borrador: sin fecha de publicación. */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'publish_date' => null,
        ]);
    }

    public function ownedBy(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}
```

---

## WorkFactory

`database/factories/WorkFactory.php`

- `medium` se elige **coherente con `category`** (un anime no es `literatura`).

```php
<?php

namespace Database\Factories;

use App\Enums\WorkCategory;
use App\Enums\WorkMedium;
use App\Models\Work;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Work>
 */
class WorkFactory extends Factory
{
    private const MEDIUMS_BY_CATEGORY = [
        'literatura' => [WorkMedium::Libro, WorkMedium::Poema, WorkMedium::Novela, WorkMedium::NovelaLigera],
        'animemanga' => [WorkMedium::Anime, WorkMedium::Manga, WorkMedium::Pelicula],
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = rtrim(fake()->sentence(3), '.');
        $category = fake()->randomElement(WorkCategory::cases());

        return [
            'title' => $title,
            'abbreviation' => strtoupper(Str::of($title)->explode(' ')->map(fn ($w) => Str::substr($w, 0, 1))->implode('')),
            'category' => $category,
            'publish_date' => fake()->date(),
            'sinopsi' => fake()->paragraphs(2, true),
            'medium' => fake()->randomElement(self::MEDIUMS_BY_CATEGORY[$category->value]),
        ];
    }

    public function literatura(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => WorkCategory::Literatura,
            'medium' => fake()->randomElement(self::MEDIUMS_BY_CATEGORY['literatura']),
        ]);
    }

    public function animeManga(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => WorkCategory::AnimeManga,
            'medium' => fake()->randomElement(self::MEDIUMS_BY_CATEGORY['animemanga']),
        ]);
    }
}
```

---

## AuthorFactory

`database/factories/AuthorFactory.php`

- En la migración `birth_year` es **`string` nullable** (no `date`, como dice el `.md`), y `description` es `string` NOT NULL (máx. 255).

```php
<?php

namespace Database\Factories;

use App\Models\Author;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Author>
 */
class AuthorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'pseudonym' => null,
            'birth_year' => fake()->year(),
            'description' => fake()->text(200),
        ];
    }

    /** Autor conocido solo por seudónimo (displayName devuelve el seudónimo). */
    public function pseudonymous(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => null,
            'last_name' => null,
            'pseudonym' => fake()->unique()->userName(),
        ]);
    }
}
```

---

## TagFactory

`database/factories/TagFactory.php`

**Primero** añade el trait al modelo `app/Models/Tag.php`:

```php
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tag extends Model
{
    use HasFactory;
    // ...
}
```

Factory (nombres únicos en minúscula, igual que normaliza `findOrCreateNormalized()`):

```php
<?php

namespace Database\Factories;

use App\Models\Tag;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Tag>
 */
class TagFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word(),
        ];
    }
}
```

---

## CommentFactory

1. Renombra `database/factories/CommentsFactory.php` → `database/factories/CommentFactory.php`.
2. Reemplaza su contenido:

```php
<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Comment>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'description' => fake()->paragraph(),
            'publish_date' => fake()->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
            'user_id' => User::factory(),
            'post_id' => Post::factory(),
            'parent_id' => null,
        ];
    }

    /** Respuesta a otro comentario: hereda el post del padre. */
    public function replyTo(Comment $parent): static
    {
        return $this->state(fn (array $attributes) => [
            'parent_id' => $parent->id,
            'post_id' => $parent->post_id,
        ]);
    }
}
```

---

## PostImageFactory

`database/factories/PostImageFactory.php`

- No existe `MediaFactory`, así que la fila de `media` se crea aquí mismo con `App\Models\Media::forceCreate()`.
- El `media` se crea **ligado al mismo post** (`model_type`/`model_id`), cumpliendo la misma regla que valida `PostImage::attach()`.
- Requiere el `protected $table = 'posts_images';` del punto 3 de arriba.
- Solo crea la fila en BD, **no un archivo real** en disco. Para tests con archivos usa `$post->addMedia(UploadedFile::fake()->image(...))`.

```php
<?php

namespace Database\Factories;

use App\Models\Media;
use App\Models\Post;
use App\Models\PostImage;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<PostImage>
 */
class PostImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'key' => fake()->unique()->slug(2),
            'post_id' => Post::factory(),
            'media_id' => fn (array $attributes) => Media::forceCreate([
                'model_type' => Post::class,
                'model_id' => $attributes['post_id'],
                'uuid' => (string) Str::uuid(),
                'collection_name' => 'gallery',
                'name' => $name = fake()->slug(2),
                'file_name' => "{$name}.webp",
                'mime_type' => 'image/webp',
                'disk' => 'public',
                'conversions_disk' => 'public',
                'size' => fake()->numberBetween(20_000, 800_000),
                'manipulations' => [],
                'custom_properties' => [],
                'generated_conversions' => [],
                'responsive_images' => [],
            ])->id,
        ];
    }

    public function cover(): static
    {
        return $this->state(fn (array $attributes) => [
            'key' => 'cover',
        ]);
    }
}
```

---

## RequestPermissionFactory

`database/factories/RequestPermissionFactory.php`

- `requested_at` y `status = pending` los pone el hook `creating`; aquí se definen igualmente para que `make()` también los tenga.
- `granted_by` se rellena siempre por el NOT NULL de la migración (ver punto 4 de arriba). Cuando hagas la columna nullable, cambia el default a `null`.
- Estados que replican las transiciones del modelo: `accepted()`, `denied()`, `used()`, `expired()`, `windowClosed()`, `stale()`.

```php
<?php

namespace Database\Factories;

use App\Enums\PermissionStatus;
use App\Models\Post;
use App\Models\RequestPermission;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RequestPermission>
 */
class RequestPermissionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'message' => fake()->sentence(12),
            'status' => PermissionStatus::Pending,
            'requested_at' => now(),
            'granted_at' => null,
            'access_expires_at' => null,
            'granted_by' => User::factory()->admin(),
            'user_id' => User::factory()->editor(),
            'post_id' => Post::factory(),
        ];
    }

    /** Aceptada con ventana de 24h abierta (isActive() === true). */
    public function accepted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PermissionStatus::Accepted,
            'granted_at' => now(),
            'access_expires_at' => now()->addHours(24),
        ]);
    }

    public function denied(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PermissionStatus::Denied,
            'granted_at' => now(),
        ]);
    }

    /** Usada dentro de la ventana, que sigue abierta. */
    public function used(): static
    {
        return $this->accepted()->state(fn (array $attributes) => [
            'status' => PermissionStatus::Used,
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PermissionStatus::Expired,
            'requested_at' => now()->subDays(8),
        ]);
    }

    /** Aceptada pero con la ventana ya vencida (isActive() === false). */
    public function windowClosed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PermissionStatus::Accepted,
            'granted_at' => now()->subDays(2),
            'access_expires_at' => now()->subDay(),
        ]);
    }

    /** Pendiente con más de 7 días: la recoge scopeStaleForExpiry(). */
    public function stale(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PermissionStatus::Pending,
            'requested_at' => now()->subDays(8),
        ]);
    }
}
```

---

## ReportFactory

`database/factories/ReportFactory.php`

- La tabla `reports` real **no** tiene `user_id` (el `.md` lo menciona en la sección de Claim, pero la migración no lo crea).
- Para vincular posts/media usa `hasAttached()` o los estados `forPost()` / `forMedia()`.

```php
<?php

namespace Database\Factories;

use App\Enums\ReportStatus;
use App\Models\Post;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Report>
 */
class ReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'message' => fake()->paragraph(),
            'status' => ReportStatus::Pending,
            'resolved_by' => null,
        ];
    }

    public function resolved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReportStatus::Resolved,
            'resolved_by' => User::factory()->admin(),
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReportStatus::Rejected,
            'resolved_by' => User::factory()->admin(),
        ]);
    }

    /** Evita reportes huérfanos: lo vincula a un post (nuevo o dado). */
    public function forPost(?Post $post = null): static
    {
        return $this->afterCreating(function (Report $report) use ($post) {
            $report->posts()->attach($post ?? Post::factory()->create());
        });
    }

    /** Vincula a uno o varios media existentes (ids o modelos). */
    public function forMedia(array $media): static
    {
        return $this->afterCreating(function (Report $report) use ($media) {
            $report->media()->attach(collect($media)->map(fn ($m) => is_object($m) ? $m->id : $m));
        });
    }
}
```

---

## BannedUserFactory

`database/factories/BannedUserFactory.php`

- `ip_address` es NOT NULL en la migración; `banned_by` debe ser un admin.

```php
<?php

namespace Database\Factories;

use App\Models\BannedUser;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BannedUser>
 */
class BannedUserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'email' => fake()->unique()->safeEmail(),
            'ip_address' => fake()->ipv4(),
            'reason' => fake()->sentence(10),
            'banned_by' => User::factory()->admin(),
        ];
    }

    /** Banea el email (e IP opcional) de un usuario existente. */
    public function forUser(User $user, ?string $ip = null): static
    {
        return $this->state(fn (array $attributes) => [
            'email' => $user->email,
            'ip_address' => $ip ?? $attributes['ip_address'],
        ]);
    }

    public function ipv6(): static
    {
        return $this->state(fn (array $attributes) => [
            'ip_address' => fake()->ipv6(),
        ]);
    }
}
```

---

## ViolationLogFactory

`database/factories/ViolationLogFactory.php`

- `action` es un string libre en el esquema; uso un catálogo corto para que los datos sean realistas. Ajústalo a las acciones que registre de verdad tu `PostPolicy`.

```php
<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use App\Models\ViolationLog;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ViolationLog>
 */
class ViolationLogFactory extends Factory
{
    private const ACTIONS = [
        'unauthorized_update',
        'unauthorized_delete',
        'expired_permission_use',
        'rate_limit_exceeded',
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'action' => fake()->randomElement(self::ACTIONS),
            'attempts_count' => fake()->numberBetween(1, 5),
            'post_id' => Post::factory(),
            'user_id' => User::factory()->editor(),
        ];
    }

    /** Violación sin post asociado (post_id es nullable). */
    public function withoutPost(): static
    {
        return $this->state(fn (array $attributes) => [
            'post_id' => null,
        ]);
    }

    /** Registro antiguo, fuera de scopeRecent(24). */
    public function old(int $hours = 48): static
    {
        return $this->state(fn (array $attributes) => [
            'created_at' => now()->subHours($hours),
            'updated_at' => now()->subHours($hours),
        ]);
    }
}
```

---

## ClaimFactory

`database/factories/ClaimFactory.php`

Cuidado con el hook `creating` de `Claim`:

- Si `user_id` apunta a un usuario con email verificado → **sobrescribe** `status` a `UnderReview`, sea cual sea el que pongas.
- Si no → **siempre** genera `verification_token` + caducidad de 24h, y solo pone `PendingVerification` si `status` venía vacío.

Por eso los estados que avanzan el flujo limpian el token en `afterCreating` (igual que haría `verifyEmail()`).

```php
<?php

namespace Database\Factories;

use App\Enums\ClaimStatus;
use App\Models\Claim;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Claim>
 */
class ClaimFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'social_proof_url' => [
                'https://x.com/' . fake()->userName(),
                'https://instagram.com/' . fake()->userName(),
            ],
            'message' => fake()->paragraphs(2, true),
            'status' => ClaimStatus::PendingVerification,
            'user_id' => null,
        ];
    }

    /** Reclamante externo con el token ya caducado (verifyEmail() devuelve false). */
    public function tokenExpired(): static
    {
        return $this->afterCreating(function (Claim $claim) {
            $claim->forceFill(['verification_token_expires_at' => now()->subHour()])->saveQuietly();
        });
    }

    /** Reclamante con cuenta verificada: el hook lo manda directo a UnderReview. */
    public function fromUser(?User $user = null): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user?->id ?? User::factory(),
            'name' => $user?->name ?? $attributes['name'],
            'email' => $user?->email ?? $attributes['email'],
        ]);
    }

    public function underReview(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ClaimStatus::UnderReview,
            'email_verified_at' => now(),
        ])->afterCreating(fn (Claim $claim) => $this->clearToken($claim));
    }

    public function approved(?string $notes = null): static
    {
        return $this->resolvedAs(ClaimStatus::Approved, $notes);
    }

    public function rejected(?string $notes = null): static
    {
        return $this->resolvedAs(ClaimStatus::Rejected, $notes);
    }

    /** Evita reclamaciones huérfanas: la vincula a un post (nuevo o dado). */
    public function forPost(?Post $post = null): static
    {
        return $this->afterCreating(function (Claim $claim) use ($post) {
            $claim->posts()->attach($post ?? Post::factory()->create());
        });
    }

    private function resolvedAs(ClaimStatus $status, ?string $notes): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => $status,
            'email_verified_at' => now()->subDays(2),
            'reviewed_by' => User::factory()->admin(),
            'reviewed_at' => now(),
            'resolution_notes' => $notes ?? fake()->sentence(),
        ])->afterCreating(fn (Claim $claim) => $this->clearToken($claim));
    }

    private function clearToken(Claim $claim): void
    {
        $claim->forceFill([
            'verification_token' => null,
            'verification_token_expires_at' => null,
        ])->saveQuietly();
    }
}
```

---

## Uso rápido (tinker / seeder)

```php
use App\Models\{User, Post, Work, Author, Tag, Comment, PostImage, RequestPermission, Report, BannedUser, ViolationLog, Claim};

$admin  = User::factory()->admin()->create(['email' => 'admin@mizume.test']);
$editor = User::factory()->editor()->create();

// Obras con autores y tags (pivotes works_authors / works_tags)
$works = Work::factory(5)
    ->hasAttached(Author::factory()->count(2), [], 'authors')
    ->hasAttached(Tag::factory()->count(3), [], 'tags')
    ->create();

// Posts del editor ligados a obras (articles_works)
$posts = Post::factory(3)->ownedBy($editor)
    ->hasAttached($works->random(2), [], 'works')
    ->create();

Post::factory()->policy()->ownedBy($admin)->create();

// Comentarios con respuesta
$comment = Comment::factory()->for($posts->first())->create();
Comment::factory()->replyTo($comment)->create();

// Imágenes del post
PostImage::factory()->cover()->for($posts->first())->create();

// Flujo de permisos
RequestPermission::factory()->for($posts->first())->create();
RequestPermission::factory()->accepted()->for($posts->last())->create(['granted_by' => $admin->id]);

// Moderación
Report::factory()->forPost($posts->first())->create();
Report::factory()->resolved()->forPost()->create();
BannedUser::factory()->create(['banned_by' => $admin->id]);
ViolationLog::factory()->for($editor)->for($posts->first())->create();

// Reclamaciones
Claim::factory()->forPost($posts->first())->create();
Claim::factory()->fromUser()->forPost()->create();
Claim::factory()->approved('Autoría confirmada')->forPost()->create();
```
