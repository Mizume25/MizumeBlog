<?php

namespace Database\Seeders;

use App\Models\Tag;
use App\Models\Work;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WorksTagsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = Tag::all();

        Work::all()->each(function (Work $work) use ($tags) {
            $work->tags()->attach(
                $tags->random(rand(1, min(3, $tags->count())))->pluck('id')
            );
        });
    }
}
