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
            file_put_contents($this->path, json_encode([], JSON_PRETTY_PRINT));
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

    private function findIndex(int $id): int|null
    {
        foreach ($this->data as $i => $item) {
            if ($item['id'] === $id) return $i;
        }
        return null;
    }

    public function set(int $id, array $config): void
    {
        $index = $this->findIndex($id);
        $entry = array_merge(['id' => $id], $config);

        if ($index !== null) {
            $this->data[$index] = $entry; // actualizar
        } else {
            $this->data[] = $entry; // insertar
        }

        $this->save();
    }

    public function delete(int $id): void
    {
        $index = $this->findIndex($id);
        if ($index !== null) {
            array_splice($this->data, $index, 1);
            $this->save();
        }
    }

    public function get(int $id): ?array
    {
        $index = $this->findIndex($id);
        return $index !== null ? $this->data[$index] : null;
    }

    // Reasignar IDs (si los necesitas reordenar)
    public function reindex(): void
    {
        $this->data = array_values($this->data);
        $this->save();
    }
}
