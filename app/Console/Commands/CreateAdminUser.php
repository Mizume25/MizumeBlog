<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Comando para crear un usuario';


    /**
     * Execute the console command.
     */
    public function handle()
    {

        $name = $this->ask('¿Name User?');
        $email = $this->ask('¿Email User?');
        $password = $this->secret('¿Password User?'); 
        $role = $this->askWithCompletion('Select  rol',
        ['admin' , 'user' , 'editor']);

        User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => $role, 
        ]);

        $this->info('Administrador creado con éxito.');
    }
}
