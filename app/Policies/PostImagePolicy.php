<?php

namespace App\Policies;

use App\Models\User;
use App\Models\PostImage;

class PostImagePolicy
{
    /**
     * Condiciion General 
     */
    public function before(User $user, string $ability) : ?bool 
    {
        return $user->role === 'admin' ? true : null;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, PostImage $image): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, PostImage $image): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, PostImage $image): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, PostImage $image): bool
    {
        return false;
    }
}
