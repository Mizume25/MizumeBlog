<?php

namespace App\Console\Commands;

use App\Http\Controllers\AdminController;
use App\Http\Requests\StorePostRequest;
use App\Models\Post;
use App\Models\User;
use App\Services\MarkdownService;
use Illuminate\Console\Command;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Str;

class CreateTestPost extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-post';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Crea un Post para testear pruebas';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (! app()->environment('local')) {
            $this->error('Este comando solo puede ejecutarse en local');
            return Command::FAILURE;
        }

        $data = [
            'title' => fake()->sentence(),
            'web_title' => fake()->sentence(),
            'tags' => fake()->words(3),
            'category' => 'literatura',
            'author' => fake()->name(),
            'description' => fake()->paragraph(),
            'code' => 'TS-' . Str::random(4),
        ];

        $admin = User::where('role', 'admin')->first();
        if (!$admin) {
            $this->error('No hay usuario admin en la BD local.');
            return Command::FAILURE;
        }

        Auth::login($admin);

        $request = StorePostRequest::create('/post', 'POST', $data);

        try {
            $request->setUserResolver(fn() => Auth::user());
            $request->setLaravelSession(app('session.store'));
            $request->setRedirector(app(\Illuminate\Routing\Redirector::class));
            $request->setContainer(app())->validateResolved();
        } catch (\Illuminate\Validation\ValidationException $e) {
            $this->error('Validación falló:');
            foreach ($e->errors() as $field => $messages) {
                $this->error("  {$field}: " . implode(', ', $messages));
            }
            return Command::FAILURE;
        }

        $controller = app(AdminController::class);
        $response = $controller->store($request);


        $this->info('Post de prueba creado');

        $session = $response->getSession();
        if ($session) {
            if ($session->has('success')) $this->info($session->get('success'));
            if ($session->has('warning')) $this->warn($session->get('warning'));
            if ($session->has('error')) $this->error($session->get('error'));
        }

        $post = Post::latest()->first();

        $this->table(
            ['Campo', 'Valor'],
            collect($post->toArray())->map(fn($v, $k) => [$k, is_array($v) ? json_encode($v) : $v])->toArray()
        );
    }
}
