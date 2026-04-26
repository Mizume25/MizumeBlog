<?php

namespace Database\Seeders;

use App\Models\Comentario;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    private function getLatestBackup(string $prefix): ?string
    {
        $backups = glob(public_path("backups/{$prefix}_*.json"));
        if (empty($backups)) return null;
        sort($backups);
        return end($backups);
    }

    private function seedPosts(): void
    {
        $path = $this->getLatestBackup('posts');
        if (!$path) {
            $this->command->warn('No hay backup de posts');
            return;
        }
        $this->command->info('Posts: ' . basename($path));
        $posts = json_decode(file_get_contents($path), true);
        foreach ($posts as $data) {
            $data['created_at'] = isset($data['created_at']) ? date('Y-m-d H:i:s', strtotime($data['created_at'])) : now();
            $data['updated_at'] = isset($data['updated_at']) ? date('Y-m-d H:i:s', strtotime($data['updated_at'])) : now();
            Post::insert($data);
        }
    }

    private function seedUsers(): void
    {
        $path = $this->getLatestBackup('users');
        if (!$path) {
            $this->command->warn('No hay backup de users');
            return;
        }
        $this->command->info('Users: ' . basename($path));
        $users = json_decode(file_get_contents($path), true);
        foreach ($users as $data) {
            $data['created_at'] = isset($data['created_at']) ? date('Y-m-d H:i:s', strtotime($data['created_at'])) : now();
            $data['updated_at'] = isset($data['updated_at']) ? date('Y-m-d H:i:s', strtotime($data['updated_at'])) : now();
            User::insert($data);
        }
    }

    private function seedComentarios(): void
    {
        $path = $this->getLatestBackup('comentarios');
        if (!$path) {
            $this->command->warn('No hay backup de comentarios');
            return;
        }
        $this->command->info('Comentarios: ' . basename($path));
        $coments = json_decode(file_get_contents($path), true);
        foreach ($coments as $data) {
            $data['created_at'] = isset($data['created_at']) ? date('Y-m-d H:i:s', strtotime($data['created_at'])) : now();
            $data['updated_at'] = isset($data['updated_at']) ? date('Y-m-d H:i:s', strtotime($data['updated_at'])) : now();
            Comentario::insert($data);
        }
    }

    public function run(): void
    {
        $this->seedPosts();
        $this->seedUsers();
        $this->seedComentarios();

        $this->command->info('Seeder completado correctamente');

        
    }
}
