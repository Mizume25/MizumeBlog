import type { ReactNode } from 'react';
import Fuse, { type FuseOptionKey, type FuseResultMatch } from 'fuse.js';
import { Search } from 'lucide-react';
import { useMemo , useState , useDeferredValue } from 'react';
import { Input } from '@/components/ui/input';

export type Indices = readonly (readonly [number, number])[];

export function Highlight({ text, indices }: { text: string; indices?: Indices }) {
    if (!indices?.length) return <>{text}</>;

    const sorted = [...indices].sort((a, b) => a[0] - b[0]);
    const out: ReactNode[] = [];
    let last = 0;

    for (const [s, e] of sorted) {
        if (e < last) continue;
        const start = Math.max(s, last);
        if (start > last) out.push(text.slice(last, start));
        out.push(
            <mark key={start} className="rounded bg-mizume-tertiary/40 px-0.5 text-inherit">
                {text.slice(start, e + 1)}
            </mark>,
        );
        last = e + 1;
    }
    out.push(text.slice(last));

    return <>{out}</>;
}




export type HighlightFn = (key: string, text: string) => ReactNode;

export type EntitySearchProps<T extends { id: number | string }> = {
    items: T[];
    keys: FuseOptionKey<T>[];
    renderCard: (item: T, hl: HighlightFn) => ReactNode;
    placeholder?: string;
    emptyText?: (query: string) => string;
    gridClassName?: string;
    threshold?: number;
};

type Result<T> = { item: T; matches: readonly FuseResultMatch[] };


const sanitize = (q: string) => q.replace(/["'!^$=|]/g, ' ').trim();

export function EntitySearch<T extends { id: number | string }>({
    items,
    keys,
    renderCard,
    placeholder = 'Buscar...',
    emptyText = (q) => `Sin coincidencias para "${q}"`,
    gridClassName = 'grid gap-3 sm:grid-cols-2 lg:grid-cols-3',
    threshold = 0.3,
}: EntitySearchProps<T>) {
    const [query, setQuery] = useState('');
    const deferred = useDeferredValue(query);

    const fuse = useMemo(
        () =>
            new Fuse<T>(items, {
                keys,
                threshold,
                ignoreLocation: true,
                ignoreDiacritics: true, // fuse.js >= 7.1
                includeMatches: true,
                minMatchCharLength: 2,
                useExtendedSearch: true, // espacio = AND entre palabras
            }),
        [items, keys, threshold],
    );

    const results: Result<T>[] = useMemo(() => {
        const q = sanitize(deferred);
        if (!q) return items.map((item) => ({ item, matches: [] }));
        return fuse.search(q).map((r) => ({ item: r.item, matches: r.matches ?? [] }));
    }, [deferred, fuse, items]);

    const makeHl =
        (r: Result<T>): HighlightFn =>
        (key, text) => <Highlight text={text} indices={r.matches.find((m) => m.key === key)?.indices} />;

    return (
        <div className="space-y-3">
            <div className="relative">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 opacity-60" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="bg-white pl-9"
                />
            </div>

            <p className="text-sm text-white/80">
                {results.length} de {items.length} resultados
            </p>

            {results.length === 0 ? (
                <p className="py-10 text-center text-white/80">{emptyText(query)}</p>
            ) : (
                <div className={gridClassName}>
                    {results.map((r) => (
                        <div key={r.item.id}>{renderCard(r.item, makeHl(r))}</div>
                    ))}
                </div>
            )}
        </div>
    );
}