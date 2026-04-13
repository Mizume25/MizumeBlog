<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    //1. Seeder Primero de mis primeros psot 
    private function seedCatalog(): void
    {
        $json_date = file_get_contents('database/data/Contenido.json');

        $arr_post = json_decode($json_date, true);

        if (!empty($arr_post)) {

            foreach ($arr_post as $data) {

                Post::create($data);
            }
        }


    }

    public function run(): void 
    {   
        //Cargamos Funcion
        $this->seedCatalog();

        $this->command->info('Post Cargados');

    }
}
