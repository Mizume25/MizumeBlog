<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\User;


class CommentPolicy
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
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Comment $comment): bool
    {
        return $this->isOwner($user , $comment);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Comment $comment): bool
    {
        return $this->isOwner($user , $comment);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Comment $comment): bool
    {
        return $this->isOwner($user , $comment);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Comment $comment): bool
    {
        return $this->isOwner($user , $comment);
    }

    private function isOwner(User $user, Comment $comment): bool
    {
        return $user->id === $comment->user_id;
    }
}
