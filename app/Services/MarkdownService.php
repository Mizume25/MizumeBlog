<?php

namespace App\Services;

class MarkdownService
{
    

    /**
     * Funcion para conter el numero de secciones
     */
    public function countSections(string $content): int
    {
        return preg_match_all('/^##[ \t]+\S/m', $content);
    }

    /**
     * Construye el índice jerárquico del markdown a partir de los encabezados
     * de nivel ## (mínimo) a ###### (máximo).
     *
     * Cada nodo: ['id' => '1.2.1', 'title' => '...', 'children' => [...]]
     * El id se calcula por posición. Se ignoran los encabezados dentro de
     * bloques de código (``` o ~~~). Si se salta un nivel, el nodo se cuelga
     * del último padre abierto.
     */
    public function extract(string $content): array
    {
        $index = [];

        /** Pila de padres abiertos: cada entrada ['level' => int, 'node' => &array] */
        $stack = [];
        $fence = null;

        foreach (preg_split('/\R/', $content) as $line) {

            if (preg_match('/^\s{0,3}(`{3,}|~{3,})/', $line, $f)) {
                if ($fence === null) {
                    $fence = $f[1][0];
                } elseif ($f[1][0] === $fence) {
                    $fence = null;
                }
                continue;
            }

            if ($fence !== null) {
                continue;
            }

            if (! preg_match('/^(#{2,6})[ \t]+(.+?)[ \t]*#*[ \t]*$/', $line, $m)) {
                continue;
            }

            $level = strlen($m[1]);
            $title = trim($m[2]);

            if ($title === '') {
                continue;
            }

            while ($stack && end($stack)['level'] >= $level) {
                array_pop($stack);
            }

            if ($stack) {
                $parent = &$stack[array_key_last($stack)]['node'];
                $id = $parent['id'] . '.' . (count($parent['children']) + 1);
                $parent['children'][] = ['id' => $id, 'title' => $title, 'children' => []];
                $node = &$parent['children'][array_key_last($parent['children'])];
                unset($parent);
            } else {
                $id = (string) (count($index) + 1);
                $index[] = ['id' => $id, 'title' => $title, 'children' => []];
                $node = &$index[array_key_last($index)];
            }

            $stack[] = ['level' => $level, 'node' => &$node];
            unset($node);
        }

        return $index;
    }

    public static function layout (string $content) 
    {
        $sections = static::countSections($content);



        return [
            'sections' => $sections,
            
        ];
    }
}
