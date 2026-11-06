/**
 * @fileoverview Archivo de Markdown Services
 */


/**
 * @interface
 */
export type Nodo = { id: string; title: string; children?: Nodo[] }; // Indice





export default class MarkdownService {

    private content: string;
    private index: Nodo[];
    private chunks: string[] = [];   // chunks[0] = 1ª sección ## (incluye el preámbulo)


    constructor(content: string, index: Nodo[]) {
        this.content = content;
        this.index = index;
        this.chunks = this.split(content);
    }

    public setContent(content: string): void {
        this.content = content
        this.chunks = this.split(content)
    }

    public setIndex(index: Nodo[]) {
        this.index = index
    }


    public getContent(): string {
        return this.content
    }

    public getIndex(): Nodo [] {
        return this.index
    }


    /** Número total de secciones */
    public total(): number {
        return this.chunks.length
    }

    /** Devuelve la sección i (base 0), limitada al rango válido */
    public section(i: number): string {
        const clamped = Math.min(Math.max(i, 0), this.chunks.length - 1);
        return this.chunks[clamped] ?? "";
    }

    /**
     * Sección (base 0) a la que pertenece un nodo del índice.
     * El primer número del id es la sección `##`: "2.1.3" → 1.
     */
    public sectionOf(id: string): number {
        const n = Number.parseInt(id.split('.')[0], 10);
        if (Number.isNaN(n)) return 0;
        return Math.min(Math.max(n - 1, 0), this.chunks.length - 1);
    }

    /*
     * Renderiza la primera seccion
     */
    public default(): string {
        return this.section(0)
    }



    /** Helpers */
    /**
     * Parte el contenido en una sola pasada, cortando en cada `##` (nivel 2 exacto, no `###`).
     * Ignora los `##` que estén dentro de bloques de código ``` o ~~~.
     * El texto anterior al primer `##` (preámbulo) se une a la primera sección.
     */
    private split(content: string): string[] {
        const lines = content.split(/\r?\n/);
        const chunks: string[] = [];
        let current: string[] = [];
        let seenH2 = false;
        let fence: string | null = null;

        for (const line of lines) {
            const open = line.match(/^\s{0,3}(`{3,}|~{3,})/);

            if (open) {
                if (fence === null) fence = open[1][0];
                else if (open[1][0] === fence) fence = null;
            } else if (fence === null && /^##[ \t]+\S/.test(line)) {
                // Misma regla que el backend (extract/countSections) para que los ids del índice coincidan
                // El primer ## no corta: el preámbulo se queda con la 1ª sección
                if (seenH2) {
                    chunks.push(current.join('\n').trim());
                    current = [];
                }
                seenH2 = true;
            }

            current.push(line);
        }

        chunks.push(current.join('\n').trim());

        return chunks;
    }



}
