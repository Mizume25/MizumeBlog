<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Work;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WorksAuthorsSeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $authors = Author::all();

        Work::all()->each(function (Work $work) use ($authors) {
            $work->authors()->attach(
                $authors->random(rand(1, min(3, $authors->count())))->pluck('id')
            );
        });
    }
}
