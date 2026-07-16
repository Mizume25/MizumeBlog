<?php

namespace Database\Seeders;


use App\Models\Post;
use App\Models\User;
use App\Models\Comment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{

    /**
     * Funcion Temporal 
     */
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

            foreach ($data["users"]  as $user) {
                $user['password'] = Hash::make(Str::random(32));
                 $userData['must_reset_password'] = empty($userData['google_id']);
                User::insert($user);
            }

            foreach ($data["comments"] as $comment) {
                Comment::create($comment);
            }






            $this->command->info('Los datos se restablecieron correctamente');
        }
    }
}
