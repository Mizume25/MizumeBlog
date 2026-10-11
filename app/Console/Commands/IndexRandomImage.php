<?php

namespace App\Console\Commands;

use App\Models\Work;
use File;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;


class IndexRandomImage extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:insert-images';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'insertar imagenes en todos los works actuales';


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
        

        Work::all()->each(function (Work $work, int $index) use ($images) {
            $imagePath = $images[$index % $images->count()];

            $work->addMedia($imagePath)
                ->preservingOriginal()
                ->toMediaCollection('cover');
        });
    }
}
