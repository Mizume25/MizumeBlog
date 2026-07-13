<?php

namespace Database\Seeders;

use App\Models\Post;


use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{

    /**
     * Funcion Temporal 
     */
    public function run(): void
    {
        $path = public_path("backups/InitApp.json");


        if (!file_exists($path)) {
            $this->command->error('No se encontro el archivo');
            return;
        } else {

            $posts = json_decode(file_get_contents($path), true);




            foreach ($posts as $data) {
                Post::create($data);
            }

            $this->command->info('Los posts se subieron correctamente');


            
        }
    }
}
