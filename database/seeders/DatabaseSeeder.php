<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    //1. Seeder Primero de mis primeros psot 
    private function seedCatalog(): void
    {
        $json_date = file_get_contents('public/data/Contenido.json');

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

        User::create([
            'name' => 'Tester',
            'email' => 'tester@test.es',
            'password' => Hash::make('1234'), 
            'role' => 'admin'
        ]);

        //Informamos del seeder 
        $this->command->info('Post Cargados');

    }
}
