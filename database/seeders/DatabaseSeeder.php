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
        $path = public_path("backups/posts_2026-04-21.json");

        if (!$path) {
            $this->command->error('No se encontro el archivo');
            return;
        } else {

            $posts = json_decode(file_get_contents($path), true);

            foreach ($posts as $data) {
                $data['created_at'] = isset($data['created_at']) ? date('Y-m-d H:i:s', strtotime($data['created_at'])) : now();
                $data['updated_at'] = isset($data['updated_at']) ? date('Y-m-d H:i:s', strtotime($data['updated_at'])) : now();
                Post::insert($data);
            }

            $this->command->info('Los posts se subieron correctamente');
        }
    }
}
