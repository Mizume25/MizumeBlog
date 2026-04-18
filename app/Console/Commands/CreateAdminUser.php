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
    protected $signature = 'app:create-admin-user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';


    /**
     * Execute the console command.
     */
    public function handle()
    {

        $name = $this->ask('Nombre del admin');
        $email = $this->ask('Email del admin');
        $password = $this->secret('Contraseña del admin'); 
        $role = $this->ask('¿Role?');

        User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => $role, 
        ]);

        $this->info('Administrador creado con éxito.');
    }
}
