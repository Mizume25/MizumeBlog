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
        ];
    }

    /**
     * Comentarios Respuesta Relacionado
     * @return HasMany 
     */
    public function comentarios()
    {
        return $this->hasMany(Comment::class, 'user_id');
    }

    
    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }


    /** Nuevas Funciones para la version 1.4.0 */
    
    /** Funciones para agregar campo uuid  publico automaticamente */
    public static function booted()
    {
        static::creating(function (User $user){
            if(empty($user->uuid)) $user->uuid = Str::uuid();
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

}
