<?php

namespace Database\Seeders;


use App\Models\Post;
use App\Models\User;
use App\Models\Comment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Password;


class DatabaseSeeder extends Seeder
{

    
    public function run(): void
    {
        $data = Storage::disk('local')->json('init.json');


        if (!$data) {
            $this->command->error('No se encontro el archivo');
            return;
        } else {

            foreach ($data["posts"] as $post) {
                Post::create($post);
            }

            $count = 0;
            foreach ($data["users"]  as $userData) {
                $userData['password'] = Hash::make(Str::random(32));
                $user = User::create($userData);


                if (empty($user['google_id']) && app()->environment('production'                                                                                                             )) {
                   Password::sendResetLink(['email' => $user->email]);
                 } else {
                    $count++;
                }
            }

            foreach ($data["comments"] as $comment) {
                Comment::create($comment);
            }





            $this->command->info('Estamos en pruebas locales, hemos detectado '                                                                                                              . $count . ' usuarios a revisar');
            $this->command->info('Los datos se restablecieron correctamente');
        }
    }
}
