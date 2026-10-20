<?php

namespace App\Console\Commands;

use App\Models\Work;
use Illuminate\Support\Str;
use Illuminate\Console\Command;


class MakeSlugFaker extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:make-slugs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Crea los slugs de los fakers actuales';


    /**
     * Execute the console command.
     */
    public function handle()
    {

        Work::whereNull('slug')->each(function ($work) {
            $work->slug = Str::slug($work->title) . '-' . $work->id;
            $work->saveQuietly();
        });
    }
}
