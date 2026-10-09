<?php

namespace Database\Seeders;

use App\Models\Media;
use App\Models\Work;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MediaSeeder extends Seeder
{
    private const MEDIA = [
        "C-antologia-de-giacomo-leopardi.jpg",
        "C-antologia-de-machado.jpg",
        "C-antologia-de-mallarme.jpg",
        "C-antologia-de-stendhal.jpg",
        "C-beautiful-bones.jpg",
        "C-bungaku-shoujo.jpg",
        "C-classroom-of-the-elite.jpg",
        "C-kamisama-memochou.jpg",
        "C-parasite-in-love.jpg",
        "C-shiki.jpg",
        "C-tatakau-shisho.jpg",
        "C-the-perfect-insider.jpg",
        "C-un-go.jpg",
        "C-zetsuen-no-tempest.jpg",
        "P-c-beautiful-bones.jpg",
        "P-c-kamisama-memochou.jpg",
        "P-c-tatakau-shisho.jpg",
    ];

    private const PATH = "/IMG/Cards";

    public function run(): void
    {

        $works = Work::all();

        foreach ($works as $work) {

            $random = self::MEDIA[array_rand(self::MEDIA)];
            $path = self::PATH . "/" . $random;

            $work->addMedia($path)
                ->preservingOriginal()
                ->toMediaCollection('images');
        }
    }
}
