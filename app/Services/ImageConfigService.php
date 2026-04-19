<?php

namespace App\Services;

class ImageConfigService
{
    // Propiedades
    private string $path;
    private array $data;

    public function __construct()
    {
        $this->path = public_path('data/Formato.json');

        if (!file_exists($this->path)) {
            file_put_contents($this->path, json_encode(new \stdClass(), JSON_PRETTY_PRINT));
        }

        $this->data = json_decode(file_get_contents($this->path), true) ?? [];
    }

    private function save(): void
    {
        file_put_contents(
            $this->path,
            json_encode($this->data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );
    }

    // Añadir o actualizar un post
    public function set(int $id, array $config): void
    {
        $this->data[(string)$id] = $config;
        $this->save();
    }

    public function delete(int $id): void
    {
        unset($this->data[(string)$id]);
        $this->save();
    }

    public function get(int $id): ?array
    {
        return $this->data[(string)$id] ?? null;
    }

    // Reasignar IDs (si los necesitas reordenar)
    public function reindex(): void
    {
        $this->data = array_values($this->data);
        $this->save();
    }
}
