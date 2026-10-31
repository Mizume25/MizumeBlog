<?php

namespace App\Console\Commands;

use App\Models\Author;
use App\Models\Work;
use Illuminate\Support\Str;
use Illuminate\Console\Command;


class MakeSlugAuthors extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:make-slugs-authors';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Crea los slugs de los fakers actuales en atuhros';


    /**
     * Execute the console command.
     */
    public function handle()
    {

        Author::whereNull('slug')->each(function ($author) {
            $author->slug = Str::slug($author->name ?? $author->last_name ?? $author->pseudonym) . '-' . $author->id;
            $author->saveQuietly();
        });
    }
}
