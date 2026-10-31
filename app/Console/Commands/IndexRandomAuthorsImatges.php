<?php

namespace App\Console\Commands;

use App\Models\Author;
use App\Models\Work;
use File;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;


class IndexRandomAuthorsImatges extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:insert-images-authors';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'insertar imagenes en todos los authors actuales';


    /**
     * Execute the console command.
     */
    public function handle()
    {

        $cardsPath = public_path('IMG/Cards');

        $images = collect(File::files($cardsPath))
            ->map(fn($file) => $file->getPathname())
            ->values();

        if ($images->isEmpty()) return;
        

        Author::all()->each(function (Author $author, int $index) use ($images) {
            $imagePath = $images[$index % $images->count()];

            $author->addMedia($imagePath)
                ->preservingOriginal()
                ->toMediaCollection('profile');
        });
    }
}
