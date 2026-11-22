<?php

namespace App\Models;

use App\Models\Comment;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Auth\MustVerifyEmail as MustVerifyEmailTrait;
use Override;

/**
 * @property UserRole|null $role
 * @property string|null $uuid
 */
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, MustVerifyEmailTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'avatar',
        'uuid'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'featured_quota' => 'integer',
        ];
    }

    /**
     * Comentarios Respuesta Relacionado
     * @return HasMany 
     */
    public function comments()
    {
        return $this->hasMany(Comment::class, 'user_id');
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }


    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }


    /** Nuevas Funciones para la version 1.4.0 */

    /** Funciones para agregar campo uuid  publico automaticamente */
    public static function booted()
    {
        static::creating(function (User $user) {
            if (empty($user->uuid)) $user->uuid = Str::uuid();
        });
    }

    /** Devolvemos uuid publico */
    public function getRouteKeyName()
    {
        return 'uuid';
    }


    /** Solicitudes que este usuario ha hecho. */
    public function permissionRequests(): HasMany
    {
        return $this->hasMany(RequestPermission::class);
    }

    /** Permisos que este usuario ha concedido a otros. */
    public function grantedPermissions(): HasMany
    {
        return $this->hasMany(RequestPermission::class, 'granted_by');
    }

    public function violationLogs(): HasMany
    {
        return $this->hasMany(ViolationLog::class);
    }

    public function bansIssued(): HasMany
    {
        return $this->hasMany(BannedUser::class, 'banned_by');
    }

    public function resolvedReports(): HasMany
    {
        return $this->hasMany(Report::class, 'resolved_by');
    }

    // --- Fichas y revisiones ---

    /** Revisiones propuestas (o cambios directos) de este usuario sobre fichas neutras. */
    public function revisions(): HasMany
    {
        return $this->hasMany(EntityRevision::class);
    }

    /** Revisiones que este usuario ha moderado. */
    public function reviewedRevisions(): HasMany
    {
        return $this->hasMany(EntityRevision::class, 'reviewed_by');
    }

    public function createdWorks(): HasMany
    {
        return $this->hasMany(Work::class, 'created_by');
    }

    public function createdAuthors(): HasMany
    {
        return $this->hasMany(Author::class, 'created_by');
    }

    // --- Destacados ---

    /** Posts propios destacados por él mismo: son los que consumen el cupo. */
    public function featuredPosts(): HasMany
    {
        return $this->posts()->featuredByOwner();
    }

    public function featuredQuotaUsed(): int
    {
        return $this->featuredPosts()->count();
    }

    /** Si el admin baja el cupo por debajo de lo usado, no se quita nada: solo no puede destacar más. */
    public function hasFeaturedQuotaAvailable(): bool
    {
        return $this->featuredQuotaUsed() < $this->featured_quota;
    }

    /** Solo el admin cambia cupos (lo comprueba la policy/controlador). */
    public function setFeaturedQuota(int $quota): bool
    {
        return $this->forceFill(['featured_quota' => max(0, min($quota, 255))])->save();
    }

    // --- Roles ---

    public function isAdmin(): bool
    {
        return $this->role === UserRole::Admin;
    }

    public function isEditor(): bool
    {
        return $this->role === UserRole::Editor;
    }


    public function hasRoleAtLeast(UserRole $role): bool
    {
        return $this->role?->atLeast($role) ?? false;
    }

    // --- Baneo ---

    public function isBanned(): bool
    {
        return BannedUser::isBanned($this->email, null);
    }

    // --- Scopes ---

    public function scopeEditors(Builder $query): Builder
    {
        return $query->where('role', UserRole::Editor);
    }

    public function scopeAdmins(Builder $query): Builder
    {
        return $query->where('role', UserRole::Admin);
    }

    public function scopeSearch(Builder $query, string $term): Builder
    {
        $like = '%'  . addcslashes($term, '%_\\') . '%';

        return $query->where(function (Builder $q) use ($like) {
            $q->where('name', 'like', $like);
        });
    }

    /**
     * Path de contenido relativo al usuario
     */
    public function path(string $code)
    {
        return 'blog/' . $this->uuid . '/' . $code . '/';
    }
}
