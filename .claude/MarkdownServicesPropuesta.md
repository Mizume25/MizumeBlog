# Propuesta: MarkdownService.ts — paginación por secciones

Archivo afectado: `resources/js/services/MarkdownService.ts`

## Idea

Mostrar un post **sección a sección** (cada sección va de un `##` al siguiente `##`) y navegar entre ellas con el `BlocSectionPage` ("Sección x / N").

En vez de recortar el contenido y recalcular las líneas `##` cada vez que se cambia de sección, el contenido se **parte una sola vez** (en el constructor y en `setContent`) y cada trozo se guarda en un array:

```
chunks[0] -> ## Primera sección ...
chunks[1] -> ## Segunda sección ...
...
```

Cambiar de sección es solo `chunks[i]`: acceso O(1), sin reparsear.

## Estado actual (antes de la propuesta)

| Pieza | Estado |
|---|---|
| `default()` | Solo devuelve la primera sección; recalcula líneas y `##` en cada llamada. |
| `position` / `sections` | Declarados pero sin usar. |
| `skipSection()` | Vacío. |
| `BlocSectionPage` (numbers) | Tiene `onChange`, pero no se le pasa en `work-show-components.tsx`. |
| `use-work-show.ts` | `body = markdown?.default()`, siempre la sección 1. |
| `PostIndexHeader` | Objeto `sections` con `max: 10` fijo y sin usar. |

## Código propuesto

```ts
export default class MarkdownService {

    private content: string;
    private index: Nodo[];
    private chunks: string[] = [];   // chunks[0] = 1ª sección ##
    private position = 0;            // base 0

    constructor(content: string, index: Nodo[]) {
        this.content = content;
        this.index = index;
        this.chunks = this.split(content);
    }

    public setContent(content: string): void {
        this.content = content;
        this.chunks = this.split(content);
        this.position = 0;
    }

    public total(): number { return this.chunks.length }
    public getPosition(): number { return this.position }

    public section(i: number): string {
        this.position = Math.min(Math.max(i, 0), this.chunks.length - 1);
        return this.chunks[this.position] ?? "";
    }

    public default(): string { return this.section(0) }

    /** Una sola pasada: corta en cada ## (fuera de bloques de código) */
    private split(content: string): string[] {
        const lines = content.split(/\r?\n/);
        const chunks: string[] = [];
        let current: string[] | null = null;
        let fence: string | null = null;

        for (const line of lines) {
            const open = line.match(/^\s{0,3}(`{3,}|~{3,})/);
            if (open) {
                if (fence === null) fence = open[1][0];
                else if (open[1][0] === fence) fence = null;
            } else if (fence === null && /^\s{0,3}##(?!#)(\s|$)/.test(line)) {
                if (current) chunks.push(current.join('\n').trim());
                current = [];
            }
            current?.push(line);
        }
        if (current) chunks.push(current.join('\n').trim());

        return chunks.length ? chunks : [content.trim()];
    }
}
```

## Decisiones / detalles

- **Preámbulo** (texto antes del primer `##`): se descarta, como hace hoy `default()`. Alternativa: guardarlo como sección propia o unirlo a la primera (cambio de una línea).
- **Sin ningún `##`**: todo el contenido es una única sección.
- **`sections` del constructor**: se elimina; `total()` sale de `chunks.length` y así no hay desajuste con `countSections` del backend.
- **`skipSection()`**: se elimina, lo sustituye `section(i)`.
- **Memoria**: los trozos ocupan lo mismo que el texto original.

## Pasos de integración

1. **`MarkdownService.ts`**: aplicar el código de arriba.
2. **`resources/js/hooks/custom/use-work-show.ts`**:
   - `const [section, setSection] = useState(0)`, que vuelve a 0 cuando cambia `content`.
   - `body = markdown?.section(section) ?? ""`.
   - Exponer `section` y `setSection`.
   - Quitar el tercer argumento `content.post.sections` del `new MarkdownService(...)`.
3. **`resources/js/core/desktop/work-show-components.tsx`**:
   - Pasar `onChange={(n) => setSection(n - 1)}` al `BlocSectionPage` (que trabaja en base 1).
   - `max` desde `markdown.total()` (o seguir con `content.post.sections`).
   - Borrar el objeto `sections` con `max: 10` de `PostIndexHeader`.
4. **(Opcional)** Clic en un nodo del índice (`Nodo.id` = `"2.1"`, …) → `setSection(Number(id.split('.')[0]) - 1)`, porque el id de primer nivel coincide con el número de la sección `##`.
