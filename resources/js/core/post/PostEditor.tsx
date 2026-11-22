/**
 * @fileoverview Editor de posts: modo visual (Milkdown Crepe) y modo Markdown (MDEditor).
 * Los dos trabajan sobre la misma cadena Markdown. Prototipo: no guarda en el servidor.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Crepe } from '@milkdown/crepe';
import { commandsCtx } from '@milkdown/kit/core';
import { addBlockTypeCommand, headingSchema, insertImageCommand } from '@milkdown/kit/preset/commonmark';
import MDEditor from '@uiw/react-md-editor';
import { Code2, PenLine, Save } from 'lucide-react';
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame.css';
import '../../../css/post-editor.css';
import { EDITOR_COMMANDS } from '@/core/post/md-commands';
import MarkdownRenderer from '@/core/post/MarkdownRenderer';
import MarkdownService from '@/services/MarkdownService';

type Lang = 'es' | 'en';

interface PostEditorProps {
    value: string;
    onChange: (value: string) => void;
    lang: Lang;
}

const LABELS = {
    es: {
        paragraph: 'Párrafo', section: 'Sección', subtitle: 'Subtítulo', heading: 'Apartado',
        placeholder: 'Empieza a escribir, o pulsa / para insertar un bloque…',
        link: 'Pega un enlace…', imageUrl: 'Enlace de la imagen', imageAlt: 'Describe la imagen (texto alternativo)',
        bold: 'Negrita', italic: 'Cursiva', strike: 'Tachado', linkButton: 'Enlace', newSection: 'Nueva sección',
        text: 'Texto', lists: 'Listas', bullet: 'Lista', ordered: 'Lista numerada',
        insert: 'Insertar', quote: 'Cita', divider: 'Separador', image: 'Imagen', table: 'Tabla', math: 'Fórmula',
        visual: 'Visual', markdown: 'Markdown', sections: 'secciones', words: 'palabras',
        unsaved: 'Cambios sin guardar', saveSoon: 'Guardar (aún no disponible)',
    },
    en: {
        paragraph: 'Paragraph', section: 'Section', subtitle: 'Subtitle', heading: 'Heading',
        placeholder: 'Start writing, or press / to insert a block…',
        link: 'Paste a link…', imageUrl: 'Image link', imageAlt: 'Describe the image (alt text)',
        bold: 'Bold', italic: 'Italic', strike: 'Strikethrough', linkButton: 'Link', newSection: 'New section',
        text: 'Text', lists: 'Lists', bullet: 'List', ordered: 'Numbered list',
        insert: 'Insert', quote: 'Quote', divider: 'Divider', image: 'Image', table: 'Table', math: 'Formula',
        visual: 'Visual', markdown: 'Markdown', sections: 'sections', words: 'words',
        unsaved: 'Unsaved changes', saveSoon: 'Save (not available yet)',
    },
} as const;

const IMAGE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/></svg>';

const SECTION_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h8M4 18h8M18 13v6M15 16h6"/></svg>';

/** Editor visual. Se monta con el valor inicial y después solo notifica cambios. */
function VisualEditor({ value, onChange, lang }: PostEditorProps) {
    const hostRef = useRef<HTMLDivElement>(null);
    const latestValue = useRef(value);
    const onChangeRef = useRef(onChange);

    // Antes del efecto de montaje: al cambiar de idioma se recrea con lo ya escrito
    useEffect(() => {
        latestValue.current = value;
        onChangeRef.current = onChange;
    }, [value, onChange]);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return;

        const t = LABELS[lang];

        // Raíz propia por montaje: destroy() es asíncrono y StrictMode monta dos veces
        const root = document.createElement('div');
        host.appendChild(root);

        const crepe = new Crepe({
            root,
            defaultValue: latestValue.current,
            // ImageBlock desactivado: guarda la proporción en el alt y destruye el texto alternativo
            features: {
                [Crepe.Feature.TopBar]: true,
                [Crepe.Feature.Toolbar]: false,
                [Crepe.Feature.ImageBlock]: false,
            },
            featureConfigs: {
                [Crepe.Feature.Placeholder]: { text: t.placeholder, mode: 'doc' },
                [Crepe.Feature.LinkTooltip]: { inputPlaceholder: t.link },
                [Crepe.Feature.TopBar]: {
                    // Sin H1: la paginación y el índice empiezan en ##
                    headingOptions: [
                        { label: t.paragraph, level: null },
                        { label: t.section, level: 2 },
                        { label: t.subtitle, level: 3 },
                        { label: t.heading, level: 4 },
                    ],
                    buildTopBar: (builder) => {
                        const keep = (key: string, hidden: string[]) => {
                            const { group } = builder.getGroup(key);
                            group.items = group.items.filter((item) => !hidden.includes(item.key));
                        };
                        keep('formatting', ['code']);
                        keep('list', ['task-list']);
                        keep('block', ['code-block']);

                        const insert = builder.getGroup('insert');

                        insert.addItem('image', {
                            icon: IMAGE_ICON,
                            active: () => false,
                            onRun: (ctx) => {
                                const src = window.prompt(t.imageUrl)?.trim();
                                if (!src) return;
                                const alt = window.prompt(t.imageAlt)?.trim() ?? '';
                                ctx.get(commandsCtx).call(insertImageCommand.key, { src, alt });
                            },
                        });

                        insert.addItem('new-section', {
                            icon: SECTION_ICON,
                            active: () => false,
                            onRun: (ctx) => {
                                ctx.get(commandsCtx).call(addBlockTypeCommand.key, {
                                    nodeType: headingSchema.type(ctx),
                                    attrs: { level: 2 },
                                });
                            },
                        });
                    },
                },
                [Crepe.Feature.BlockEdit]: {
                    textGroup: {
                        label: t.text,
                        text: { label: t.paragraph },
                        h1: null,
                        h2: { label: t.section },
                        h3: { label: t.subtitle },
                        h4: { label: t.heading },
                        h5: null,
                        h6: null,
                        quote: { label: t.quote },
                        divider: { label: t.divider },
                    },
                    listGroup: {
                        label: t.lists,
                        bulletList: { label: t.bullet },
                        orderedList: { label: t.ordered },
                        taskList: null,
                    },
                    advancedGroup: {
                        label: t.insert,
                        table: { label: t.table },
                        math: { label: t.math },
                        codeBlock: null,
                    },
                },
            },
        });

        crepe.on((listener) => {
            listener.markdownUpdated((_ctx, markdown, previous) => {
                if (markdown !== previous) onChangeRef.current(markdown);
            });
        });

        // La barra de Crepe no da nombre a sus botones: mismo orden que los grupos de buildTopBar
        const ready = crepe.create().then(() => {
            const names = [t.bold, t.italic, t.strike, t.bullet, t.ordered, t.linkButton, t.table, t.image, t.newSection, t.math, t.quote, t.divider];
            root.querySelectorAll<HTMLButtonElement>('.milkdown-top-bar button').forEach((button, i) => {
                const name = names[i - 1];
                if (!name) return;
                button.title = name;
                button.setAttribute('aria-label', name);
            });
        });

        return () => {
            ready.then(() => crepe.destroy()).finally(() => root.remove());
        };
    }, [lang]);

    return <div ref={hostRef} />;
}

export default function PostEditor({ value, onChange, lang }: PostEditorProps) {
    const [mode, setMode] = useState<'visual' | 'markdown'>('visual');
    const t = LABELS[lang];

    /** Contenido al abrir el editor: PostEditor se remonta con cada post (key) */
    const [savedValue] = useState(value);
    const dirty = value !== savedValue;

    const stats = useMemo(() => ({
        sections: new MarkdownService(value, []).total(),
        words: value.trim() ? value.trim().split(/\s+/).length : 0,
    }), [value]);

    const modes = [
        { id: 'visual', label: t.visual, Icon: PenLine },
        { id: 'markdown', label: t.markdown, Icon: Code2 },
    ] as const;

    return (
        // Sin overflow-hidden en este contenedor: anularía el sticky de la barra y de Guardar
        <div className="post-editor rounded-xl border border-md-border bg-mizume-fourthary">
            {/* Altura 0: el botón flota sobre la barra de cualquiera de los dos modos */}
            <div className="sticky top-1 z-30 flex h-0 items-start justify-end">
                <div className="flex h-11 items-center gap-2 pr-2">
                    {dirty && <span role="status" className="hidden text-xs text-md-muted sm:inline">{t.unsaved}</span>}
                    {/* Prototipo: se activará cuando exista el guardado en el servidor */}
                    <button
                        type="button"
                        disabled
                        title={t.saveSoon}
                        aria-label={t.saveSoon}
                        className="flex h-8 w-8 items-center justify-center rounded-md bg-btn-success text-btn-success-foreground disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Save size={16} />
                    </button>
                </div>
            </div>

            {mode === 'visual'
                ? <VisualEditor value={value} onChange={onChange} lang={lang} />
                : (
                    <MDEditor
                        value={value}
                        onChange={(val) => onChange(val ?? '')}
                        data-color-mode="dark"
                        height="auto"
                        preview="edit"
                        components={{ preview: (source) => <MarkdownRenderer content={source} /> }}
                        commands={EDITOR_COMMANDS}
                    />
                )}

            <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-md-border px-4 py-2 text-xs text-md-muted">
                <span>{stats.sections} {stats.sections === 1 ? t.section.toLowerCase() : t.sections} · {stats.words.toLocaleString(lang)} {t.words}</span>
                <div role="group" className="flex gap-1">
                    {modes.map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            type="button"
                            aria-pressed={mode === id}
                            onClick={() => setMode(id)}
                            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-md-muted transition-colors hover:bg-md-accent/15 aria-pressed:bg-md-accent/25 aria-pressed:text-md-text"
                        >
                            <Icon size={14} /> {label}
                        </button>
                    ))}
                </div>
            </footer>
        </div>
    );
}
