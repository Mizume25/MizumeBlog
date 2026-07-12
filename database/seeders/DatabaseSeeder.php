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
        $json = public_path('data/Formato.json');

        if (!$path || !$json) {
            $this->command->error('No se encontro el archivo');
            return;
        } else {

            $posts = json_decode(file_get_contents($path), true);

            $configs = json_decode(file_get_contents($json), true);
            $key = collect($configs)->keyBy('id');


            foreach ($posts as $data) {
                unset($data['created_at'], $data['updated_at']);

                $config = $key->get($data['id']);

                $data['config'] = json_encode($data['config'] ?? [
                    'home_config'    => $config['home_config'] ?? null,
                    'article_config' => $config['article_config'] ?? null,
                    'card_config'    => $config['card_config'] ?? null,
                ]);

                Post::insert($data);
            }

            $this->command->info('Los posts se subieron correctamente');
        }
    }
}
