import { useState } from 'react';
import { Config, Post } from '@/types';


type Tab = 'card' | 'home' | 'article';

type ImageConfigPanelProps = {
    post: Post;
    /** Imagen para el template Card. Default: post.cover_card */
    cardImage?: string;
    /** Imagen para los templates Home y Article (comparten el mismo archivo). Default: post.cover */
    coverImage?: string;
    onChange?: (config: Config) => void;
};

/* ------------------------------------------------------------------ */
/*  Helpers de parseo: extraen el número desde el formato ya guardado  */
/*  Funciona igual sin importar si el valor llega como "12%",          */
/*  "center 12%" o ya envuelto en "bg-[center_12%]" — solo se toma     */
/*  el primer número que aparezca.                                     */
/* ------------------------------------------------------------------ */

function parsePercent(value: string | undefined, fallback: number): number {
    if (!value) return fallback;
    const match = value.match(/(\d+)%/);
    return match ? Number(match[1]) : fallback;
}

/* ------------------------------------------------------------------ */
/*  Subcomponentes de control                                          */
/* ------------------------------------------------------------------ */

type SliderProps = {
    label: string;
    value: number;
    onChange: (next: number) => void;
    min?: number;
    max?: number;
};

function ConfigSlider({ label, value, onChange, min = 0, max = 100 }: SliderProps) {
    const clamp = (n: number) => Math.max(min, Math.min(max, n));

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#8c6c44] font-bold">
                    {label}
                </span>
                <span className="text-xs font-mono text-black/50">{value}%</span>
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => onChange(clamp(value - 1))}
                    className="w-7 h-7 shrink-0 rounded-full border-[1.5px] border-black bg-white text-black font-bold text-sm flex items-center justify-center active:scale-95 transition-transform"
                >
                    −
                </button>
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(clamp(Number(e.target.value)))}
                    className="flex-1 accent-[#8c6c44] h-1.5"
                />
                <button
                    type="button"
                    onClick={() => onChange(clamp(value + 1))}
                    className="w-7 h-7 shrink-0 rounded-full border-[1.5px] border-black bg-white text-black font-bold text-sm flex items-center justify-center active:scale-95 transition-transform"
                >
                    +
                </button>
            </div>
        </div>
    );
}

type OutputRowProps = {
    label: string;
    code: string;
};

function ConfigOutput({ label, code }: OutputRowProps) {
    const [copied, setCopied] = useState(false);

    return (
        <div className="flex items-center justify-between gap-3 bg-black/85 rounded-lg px-3 py-2">
            <div className="min-w-0">
                <p className="text-[0.6rem] uppercase tracking-widest text-white/40">{label}</p>
                <code className="text-[#e9c98f] text-sm font-mono truncate block">{code}</code>
            </div>
            <button
                type="button"
                onClick={() => {
                    navigator.clipboard?.writeText(code);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1200);
                }}
                className="shrink-0 text-[0.65rem] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full bg-[#d2a264] text-black active:scale-95 transition-transform"
            >
                {copied ? 'Copiado' : 'Copiar'}
            </button>
        </div>
    );
}

type ConfigTabsProps = {
    active: Tab;
    onSelect: (tab: Tab) => void;
};

const TABS: { id: Tab; label: string }[] = [
    { id: 'card', label: 'Card' },
    { id: 'home', label: 'Home' },
    { id: 'article', label: 'Article' },
];

function ConfigTabs({ active, onSelect }: ConfigTabsProps) {
    return (
        <div className="flex gap-2 border-b-[2px] border-black/10">
            {TABS.map((t) => (
                <button
                    key={t.id}
                    type="button"
                    onClick={() => onSelect(t.id)}
                    className={`px-4 py-2 text-sm font-bold uppercase tracking-wide rounded-t-lg border-[2px] border-b-0 transition-colors ${
                        active === t.id
                            ? 'bg-white border-black text-black'
                            : 'bg-transparent border-transparent text-black/40 hover:text-black/70'
                    }`}
                >
                    {t.label}
                </button>
            ))}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Previews: reflejan tus templates reales, filtrados por hidden      */
/*  Exportados para poder usarlos sueltos (ej. en LibraryCard real)    */
/*                                                                       */
/*  card  -> object-position (imagen <img>), un solo eje (X)           */
/*  home / article -> background-position, eje Y, X fijo en "center"   */
/* ------------------------------------------------------------------ */

type PreviewProps = {
    post: Post;
    previewImage: string;
    visible?: boolean;
};

export function CardPreview({ post, previewImage, visible = true, x }: PreviewProps & { x: number }) {
    const tags = post.tags?.split(',').map((g) => g.trim()) ?? [];

    return (
        <div className={visible ? 'block' : 'hidden'}>
            <div className="flex flex-col h-[220px] w-full max-w-[420px] mx-auto bg-[#d2a264] border-[2px] border-black rounded-[20px] overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <header className="h-[38px] bg-[#c59454] border-b-[2px] border-black flex items-center justify-between px-3 shrink-0">
                    <h2 className="text-xs font-bold truncate pr-2 uppercase text-black">
                        {post.title}
                    </h2>
                    <div className="flex gap-1 shrink-0">
                        {tags.slice(0, 1).map((g) => (
                            <span
                                key={g}
                                className="px-2.5 py-1 bg-[#8c6c44] text-white rounded-full text-[0.55rem] font-bold uppercase"
                            >
                                {g}
                            </span>
                        ))}
                    </div>
                </header>
                <main className="flex flex-row h-full overflow-hidden">
                    <section className="w-[35%] shrink-0 bg-[#e5e5e5] border-r-[2px] border-black/20 overflow-hidden">
                        <img
                            src={previewImage}
                            alt={`Portada de ${post.title}`}
                            className="w-full h-full object-cover"
                            style={{ objectPosition: `${x}% center` }}
                        />
                    </section>
                    <section className="flex-1 p-3 bg-[#d2b48c] overflow-hidden">
                        <p className="text-[0.55rem] uppercase tracking-widest text-black/60 mb-1 font-medium">
                            {post.author} · {post.publish_date}
                        </p>
                        <h3 className="capitalize text-sm font-extrabold mb-1 text-black leading-tight">
                            {post.web_title}
                        </h3>
                        <p className="text-[0.65rem] leading-relaxed text-black/90 font-medium line-clamp-4">
                            {post.description}
                        </p>
                    </section>
                </main>
            </div>
        </div>
    );
}

export function HomePreview({ post, previewImage, visible = true, y }: PreviewProps & { y: number }) {
    return (
        <div className={visible ? 'block' : 'hidden'}>
            <div
                className="relative w-full max-w-[420px] mx-auto h-[220px] rounded-[16px] overflow-hidden border-[2px] border-black bg-cover bg-no-repeat"
                style={{
                    backgroundImage: `url(${previewImage})`,
                    backgroundPosition: `center ${y}%`,
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                    <h2 className="text-white text-lg font-bold [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8)]">
                        {post.title}
                    </h2>
                    <p className="text-white/90 italic text-xs text-right [text-shadow:_1px_1px_3px_rgba(0,0,0,0.6)]">
                        {post.web_title}
                    </p>
                </div>
            </div>
        </div>
    );
}

export function ArticlePreview({ post, previewImage, visible = true, y }: PreviewProps & { y: number }) {
    return (
        <div className={visible ? 'block' : 'hidden'}>
            <div className="relative w-full max-w-[420px] mx-auto h-[220px] rounded-[16px] overflow-hidden border-[2px] border-black">
                <header
                    className="w-full h-full bg-no-repeat bg-cover"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url(${previewImage})`,
                        backgroundPosition: `center ${y}%`,
                    }}
                />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-[88%]">
                    <div className="bg-[#C8AD7F] py-2 rounded-xl shadow-lg border border-[#b39a6f] text-center">
                        <h1 className="text-base sm:text-lg font-bold text-white tracking-wide uppercase [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8)]">
                            {post.title}
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Panel de edición de UN post                                        */
/* ------------------------------------------------------------------ */

export function ImageConfigPanel({
    post,
    cardImage = post.cover_card ? `/IMG/Cards/${post.cover_card}` : '',
    coverImage = post.cover ? `/IMG/Portada/${post.cover}` : '',
    onChange,
}: ImageConfigPanelProps) {
    const [tab, setTab] = useState<Tab>('card');

    const [cardX, setCardX] = useState(() => parsePercent(post.config?.card_config, 10));
    const [homeY, setHomeY] = useState(() => parsePercent(post.config?.home_config, 12));
    const [articleY, setArticleY] = useState(() => parsePercent(post.config?.article_config, 14));

    const emit = (next: Config) => onChange?.({ ...post.config, ...next });

    // card: object-position, un solo eje, valor crudo "X%"
    const handleCardX = (v: number) => {
        setCardX(v);
        emit({ card_config: `${v}%` });
    };

    // home / article: background-position, mismo tratamiento, "center Y%"
    // (sin envolver en bg-[...] — eso lo hace el backend/tu propio helper,
    // nunca un template literal dentro de un archivo que Tailwind escanea)
    const handleHomeY = (v: number) => {
        setHomeY(v);
        emit({ home_config: `center ${v}%` });
    };
    const handleArticleY = (v: number) => {
        setArticleY(v);
        emit({ article_config: `center ${v}%` });
    };

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-extrabold text-black tracking-tight">
                    Config de posición de imagen
                </h1>
                <p className="text-sm text-black/60">
                    Editando <span className="font-bold">{post.title}</span>. El
                    valor mostrado es el número final — tú lo envuelves en la clase
                    de Tailwind que corresponda.
                </p>
            </div>

            <ConfigTabs active={tab} onSelect={setTab} />

            <div className="bg-white border-[2px] border-black rounded-[18px] p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] flex flex-col gap-5">
                {/* Los 3 previews están siempre montados; se ocultan con hidden/block */}
                <CardPreview post={post} previewImage={cardImage} visible={tab === 'card'} x={cardX} />
                <HomePreview post={post} previewImage={coverImage} visible={tab === 'home'} y={homeY} />
                <ArticlePreview post={post} previewImage={coverImage} visible={tab === 'article'} y={articleY} />

                <div className={tab === 'card' ? 'block' : 'hidden'}>
                    <ConfigSlider label="Posición horizontal (X)" value={cardX} onChange={handleCardX} />
                </div>
                <div className={tab === 'home' ? 'block' : 'hidden'}>
                    <ConfigSlider label="Posición vertical (Y)" value={homeY} onChange={handleHomeY} />
                </div>
                <div className={tab === 'article' ? 'block' : 'hidden'}>
                    <ConfigSlider label="Posición vertical (Y)" value={articleY} onChange={handleArticleY} />
                </div>

                <div className={tab === 'card' ? 'block' : 'hidden'}>
                    <ConfigOutput label="card_config" code={`${cardX}%`} />
                </div>
                <div className={tab === 'home' ? 'block' : 'hidden'}>
                    <ConfigOutput label="home_config" code={`center ${homeY}%`} />
                </div>
                <div className={tab === 'article' ? 'block' : 'hidden'}>
                    <ConfigOutput label="article_config" code={`center ${articleY}%`} />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-widest text-black/40 font-bold">
                    Resumen actual (config completo del post)
                </p>
                <div className="grid grid-cols-1 gap-2">
                    <ConfigOutput label="card_config" code={`${cardX}%`} />
                    <ConfigOutput label="home_config" code={`center ${homeY}%`} />
                    <ConfigOutput label="article_config" code={`center ${articleY}%`} />
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Contenedor: 1 sola interfaz para TODOS los posts                   */
/*  (selector a la izquierda + panel de edición a la derecha)          */
/* ------------------------------------------------------------------ */

type PostsImageConfiguratorProps = {
    posts: Post[];
    /** Se dispara con (postId, config) cada vez que cambia un valor */
    onChange?: (postId: Post['id'], config: Config) => void;
};

export function LibraryFormat({ posts, onChange }: PostsImageConfiguratorProps) {
    const [selectedId, setSelectedId] = useState<Post['id'] | null>(posts[0]?.id ?? null);
    const selected = posts.find((p) => p.id === selectedId) ?? null;

    return (
        <div className="w-full max-w-5xl mx-auto flex gap-6 items-start">
            {/* Selector de posts */}
            <aside className="w-[220px] shrink-0 flex flex-col gap-1 bg-white border-[2px] border-black rounded-[16px] p-2 max-h-[70vh] overflow-y-auto">
                {posts.map((p) => (
                    <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedId(p.id)}
                        className={`capitalize text-left px-3 py-2 rounded-lg text-sm font-bold truncate transition-colors ${
                            p.id === selectedId
                                ? 'bg-[#d2a264] text-black'
                                : 'bg-transparent text-black/50 hover:bg-black/5'
                        }`}
                    >
                        {p.title}
                    </button>
                ))}
                {posts.length === 0 && (
                    <p className="text-xs text-black/40 p-3">No hay posts.</p>
                )}
            </aside>

            {/* Panel de edición del post seleccionado */}
            <div className="flex-1">
                {selected ? (
                    <ImageConfigPanel
                        key={selected.id}
                        post={selected}
                        onChange={(config) => onChange?.(selected.id, config)}
                    />
                ) : (
                    <p className="text-black/40 text-sm">Selecciona un post.</p>
                )}
            </div>
        </div>
    );
}

/**
 * Export default = la interfaz completa (lista + edición de todos los posts).
 * Si en algún lugar solo necesitas editar UN post ya conocido, importa
 * { ImageConfigPanel } en vez del default.
 */
export default LibraryFormat;