<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * Pivote post <-> author (1:1).
 *
 * unique(author_id) + unique(post_id): un author tiene un único post y ese post no se comparte.
 * La FK (post_id, article_type) solo admite posts con article_type = 'author'.
 */
class ArticleAuthor extends Pivot
{
    protected $table = 'articles_authors';

    public $incrementing = true;
}
