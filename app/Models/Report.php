<?php

namespace App\Models;

use App\Enums\ReportStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Report extends Model
{   
    use HasFactory;

    protected $fillable = ['message'];
     protected function casts(): array
    {
        return ['status' => ReportStatus::class];
    }

    protected static function booted(): void
    {
        static::creating(function (Report $report) {
            $report->status ??= ReportStatus::Pending;
        });
    }

    // --- Relaciones ---

    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class, 'reports_post');
    }

    public function media(): BelongsToMany
    {
        return $this->belongsToMany(\Spatie\MediaLibrary\MediaCollections\Models\Media::class, 'reports_media');
    }

    public function resolver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    // --- Scopes ---

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', ReportStatus::Pending);
    }

    public function scopeResolved(Builder $query): Builder
    {
        return $query->where('status', ReportStatus::Resolved);
    }

    // --- Transiciones ---

    public function resolve(User $admin): void
    {
        $this->update(['status' => ReportStatus::Resolved, 'resolved_by' => $admin->id]);
    }

    public function reject(User $admin): void
    {
        $this->update(['status' => ReportStatus::Rejected, 'resolved_by' => $admin->id]);
    }
}
