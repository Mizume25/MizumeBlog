<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class RemovedUsersFaker extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:remove-fakers';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Comando para borrar datos fake de un usuarios';


    /**
     * Execute the console command.
     */
    public function handle()
    {

        $uuids = User::pluck('uuid');

        foreach ($uuids as $uuid) Storage::disk('local')->deleteDirectory('blog/' . $uuid);
        
    }
}
