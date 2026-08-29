<?php

namespace App\Console\Commands;

use App\Models\Post;
use Illuminate\Console\Command;
use App\DTO\Config;

class SeedPostFormat extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:seed-configs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Setear valores por defecto a todos los post';

    /**
     * Execute the console command.
     */

    public function handle()
    {
        $path = storage_path('app/private/format.json');

        if (!file_exists($path)) {
            $this->error("No existe el archivo: {$path}");
            return 1;
        }

        $raw = json_decode(file_get_contents($path), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->error('JSON inválido: ' . json_last_error_msg());
            return 1;
        }

        try {
            $config = Config::fromArray($raw);
        } catch (\App\DTO\Exceptions\InvalidConfigExceptions $e) {
            $this->error('Config inválido: ' . $e->getMessage());
            return 1;
        }

        $count = 0;
        Post::query()->chunkById(200, function ($posts) use ($config, &$count) {
            foreach ($posts as $post) {
                $post->update(['config' => $config]);
                $count++;
            }
        });

        $this->info("Listo: {$count} posts actualizados.");
        return 0;
    }
}
