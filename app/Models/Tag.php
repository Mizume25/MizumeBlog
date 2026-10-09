<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;
class Tag extends Model
{   
    use HasFactory;
    protected $fillable = ['name'];

    public function works(): BelongsToMany
    {
        return $this->belongsToMany(Work::class, 'works_tags')->withTimestamps();
    }

    public function scopePopular(Builder $query): Builder
    {
        return $query->withCount('works')->orderByDesc('works_count');
    }

    
    public static function findOrCreateNormalized(string $name): self
    {
        $normalized = Str::of($name)->trim()->lower()->value();

        return static::query()
            ->whereRaw('LOWER(name) = ?', [$normalized])
            ->first() ?? static::create(['name' => trim($name)]);
    }
}
