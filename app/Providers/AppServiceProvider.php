<?php

namespace App\Providers;
use Illuminate\Support\ServiceProvider;
use App\Services\ImageConfigService;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(ImageConfigService::class, function () {
            return new ImageConfigService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
