<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    private function seedCatalog(): void
    {
        // Buscar el backup más reciente
        $backups = glob(storage_path('backups/posts_*.json'));

        // Si no hay backups usar el archivo original como fallback
        if (empty($backups)) {
            $this->command->warn('No hay backups, usando Contenido.json como fallback');
            $path = public_path('data/Contenido.json');
        } else {
            sort($backups);
            $path = end($backups);
            $this->command->info('Usando backup: ' . basename($path));
        }

        $posts = json_decode(file_get_contents($path), true);

        if (!empty($posts)) {
            foreach ($posts as $data) {
                Post::create($data);
            }
        }
    }

    public function run(): void
    {
        $this->seedCatalog();

        User::create([
            'name'     => 'Tester',
            'email'    => 'tester@test.es',
            'password' => Hash::make('1234'),
            'role'     => 'admin'
        ]);

        $this->command->info('Posts cargados correctamente');
    }
}