<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * Pivote post <-> work.
 *
 * Copia automáticamente el user_id del post al hacer attach/sync,
 * desde cualquiera de los dos lados ($post->works() o $work->posts()).
 * La BD rechaza un segundo post del mismo usuario sobre el mismo work.
 */
class ArticleWork extends Pivot
{
    protected $table = 'articles_works';

    public $incrementing = true;

    protected static function booted(): void
    {
        static::creating(function (ArticleWork $pivot) {
            if (empty($pivot->user_id)) {
                $pivot->user_id = Post::whereKey($pivot->post_id)->value('user_id');
            }
        });
    }
}
