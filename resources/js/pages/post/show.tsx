/** Interfaces web utilizadas */
import { ArticleConfig, Artwork, BackgroundOptions, BackgroundPositionKeyword, IndexContent, formatDefault, type Content } from '@/types';

/** Eestados e iconos react */
import { Head } from '@inertiajs/react';
import { ListTree } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

/** COMPONENTES  */
import SideBarRight from '@/core/auth/SideBarRight';
import Coments from '@/core/coments/Coments';
import BlogLayout from '@/layouts/app/blog-layout';
import { PostContent, PostSideBarLeft } from '../../core/post';

/** @import Folders */
import { Folder, FolderOpen } from 'lucide-react';

/** @import Componenetes Modal */
import ApiToast from '@/components/api-toast';
import ModalOperation from '@/components/modal-operation';
import { useToast } from '@/hooks/use-toast';
import PanelEdit from '@/layouts/app/panel-edit';
import { configApi } from '@/types/api';
import { DialogTitle } from '@headlessui/react';
/**
 *
 * @param routa Ruta de la imagen
 * @param title Titulo de el post
 * @param formato Formato de imagen
 * @returns
 */
function PostHeader({ route, title, format }: { route: string | undefined; title: string; format: ArticleConfig | undefined }) {
    const config = String(format?.height ?? 30);

    return (
        <>
            {/* Imagen de la obra */}
            <header
                className={`w-full bg-cover bg-no-repeat`}
                style={{
                    height: `${format?.height}`,
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${route})`,
                    backgroundPosition: `${format?.position}`,
                }}
            ></header>

            {/* Titulo de la obra */}
            <div className="relative z-10 -mt-10 flex justify-center px-4">
                <div className="w-full max-w-4xl rounded-xl border border-[#b39a6f] bg-[#C8AD7F] py-4 text-center shadow-lg">
                    <h2 className="title text-2xl font-bold tracking-wide text-white uppercase sm:text-3xl md:text-5xl">{title}</h2>
                </div>
            </div>
        </>
    );
}

/**
 * Boton Indice para Post
 * @param Function Funcion para abrir y cerrar SideBar
 * @returns
 */
function PostBTN({ onOpen }: { onOpen?: (e: React.MouseEvent<HTMLButtonElement>) => void }) {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => onOpen?.(e);

    return (
        <button
            onClick={handleClick}
            className="fixed top-[58px] right-2 z-40 mt-10 cursor-pointer rounded-lg border border-white/20 bg-[#754C22] p-2.5 shadow-lg transition-all active:scale-95 sm:top-[42px] lg:hidden"
        >
            <div className="space-y-1.5">
                <ListTree size={22} className="text-white" />
            </div>
        </button>
    );
}

interface ShowProps {
    content: Content;
    artworks: Artwork[];
}

function show({ content, artworks }: ShowProps) {
    const MIN = 20;
    const MAX = 90;
    const DEFAULT_HEIGHT = 35;

    /** Ruta de la Portada */
    const cover = `/IMG/Portada/${content.post.cover}`;

    /** Formato de la portada */
    const [format, setFormat] = useState<ArticleConfig | undefined>(content.post.config?.article ?? formatDefault.article);

    /** Formato de la portada renderizada a estado  */
    useEffect(() => setFormat(content.post.config?.article ?? undefined), [content.post.id]);

    /** Indice de Contenido */
    const index: IndexContent[] = content.index;

    /** Punto del indice selecionado */
    const [selectedId, setSelectedId] = useState<string>('puntos-capitales');

    /** Sidebar del Indice */
    const [sidebar, setSidebar] = useState(false);

    const [confirm, setConfirm] = useState(false);

    /** Iteración de indice */
    const handleFindID = (id: string) => setSelectedId(id);

    const { showToast, toast } = useToast();

    /** Toogle de cerrado */
    const onOpen = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        setSidebar((prev) => !prev);
    }, []);

    /** Cerrado de Indice */
    const isClose = () => setSidebar(false);

    const [isOpen, setIsOpen] = useState(false);

    const [edit, setEdit] = useState(false);
    const handlerClick = () => {
        setIsOpen(true);
    };

    const handlerEdit = () => setEdit((prev) => !prev);

    const [position, setPosition] = useState<BackgroundPositionKeyword | null>(null);

    const [height, setHeight] = useState(DEFAULT_HEIGHT);

    /** Api para confirmar cambios */
    const ApiArticleUpdate = async () => {
        if (position == null) return;
        if (format == null) return;
        await configApi
            .updateArticle(Number(content.post.id), format)
            .then((data) => showToast('success', data.message))
            .catch((err) => showToast('error', err.message));
    };

    useEffect(() => {
        if (position == null) return;
        setFormat((prev) => ({ height: prev?.height ?? '30vh', position: position ?? 'center' }));
        console.log('posicion actual', position);
    }, [position]);

    function clamp(n: number) {
        return Math.min(MAX, Math.max(MIN, n));
    }

    useEffect(() => {
        if (edit) {
            setFormat(formatDefault.article);
        } else {
            setFormat(content.post.config?.article ?? formatDefault.article);
        }
    }, [edit]);

    useEffect(() => {
        const originalPosition = content.post.config?.article?.position ?? null;
        const originalHeightRaw = content.post.config?.article?.height;
        const originalHeight = originalHeightRaw ? parseInt(originalHeightRaw, 10) : DEFAULT_HEIGHT;

        const positionChanged = position != null && position !== originalPosition;
        const heightChanged = height !== originalHeight;

        setConfirm(positionChanged || heightChanged);
    }, [position, height]);

    return (
        <BlogLayout post_id={content.post.id} edit={edit} onEdit={handlerEdit}>
            {/* Pestaña de la Página */}
            <Head title={content.post.title}></Head>
            <ApiToast toast={toast} />
            {/* Componente imagen header */}
            <PostHeader route={cover} title={content.post.title} format={format} />

            {/** Componente para indice button */}
            <PostBTN onOpen={onOpen} />

            {/* Contenedor del Main */}
            <main className="mx-auto mt-20 max-w-[1700px] px-4 pb-24 sm:px-6">
                <div className="relative grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
                    <PostSideBarLeft list={index} onFindID={handleFindID} sidebar={sidebar} isClose={isClose} post_id={content.post.id} />

                    <PostContent post={content.post} contenido={content.body} raw={content.raw} selectedId={selectedId} handlerCick={handlerClick} />

                    <SideBarRight
                        posts={content.features}
                        featuredTitle="Artículos / Post Destacados"
                        showProfile
                        variant="light"
                        sticky="lg:top-24"
                        colSpan="lg:col-span-3"
                    />
                    <Coments coments={content.comments} post_id={content.post.id} />
                </div>
            </main>

            {edit && (
                <PanelEdit>
                    <h3 className="mb-2 text-lg font-bold text-white">Posicion</h3>
                    <p className="mb-4 text-sm text-gray-100">Configura las opciones del layout aquí.</p>

                    <select
                        className={`mb-5 w-full cursor-pointer rounded-xl bg-amber-100 p-2 text-black capitalize outline-none focus:bg-amber-200 disabled:bg-amber-200/20`}
                        onChange={(e) => setPosition(e.target.value as BackgroundPositionKeyword)}
                    >
                        {BackgroundOptions.map((p, i) => (
                            <option key={i} value={p} className="bg-white text-black">
                                {p}
                            </option>
                        ))}
                    </select>
                    <h3 className="mb-2 text-lg font-bold text-white">Altura</h3>
                    <div className="mb-2 flex items-center gap-2">
                        <input
                            type="number"
                            min={MIN}
                            max={MAX}
                            value={height}
                            onChange={(e) => setHeight(clamp(Number(e.target.value)))}
                            className="w-full [appearance:textfield] rounded-xl border border-[#2a2f3a] bg-[#171a21] px-4 py-2.5 font-mono text-[15px] text-[#e8eaed] tabular-nums transition-colors duration-150 outline-none focus:border-[#5b8cff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b8cff] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />

                        <div className="flex flex-none items-center gap-1">
                            <button
                                type="button"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2a2f3a] bg-[#171a21] text-lg leading-none text-[#e8eaed] transition-colors duration-150 hover:border-[#5b8cff] hover:text-[#5b8cff] active:scale-95"
                                aria-label="Disminuir"
                                onClick={() => setHeight((h: number) => clamp(h - 1))}
                            >
                                −
                            </button>

                            <button
                                type="button"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2a2f3a] bg-[#171a21] text-xs text-[#8a90a0] transition-colors duration-150 hover:border-[#5b8cff] hover:text-[#5b8cff] active:scale-95"
                                aria-label="Restablecer"
                                title="Restablecer"
                                onClick={() => setHeight(DEFAULT_HEIGHT)}
                            >
                                ↺
                            </button>

                            <button
                                type="button"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2a2f3a] bg-[#171a21] text-lg leading-none text-[#e8eaed] transition-colors duration-150 hover:border-[#5b8cff] hover:text-[#5b8cff] active:scale-95"
                                aria-label="Aumentar"
                                onClick={() => setHeight((h: number) => clamp(h + 1))}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={ApiArticleUpdate}
                        className="bg-btn-success text-btn-success-foreground mb-2 w-full rounded-xl px-4 py-2 transition-colors not-disabled:cursor-pointer disabled:bg-white/60"
                        disabled={!confirm}
                    >
                        Confirmar Cambio
                    </button>

                    <button
                        onClick={() => setEdit(false)}
                        className="bg-btn-info text-btn-info-foreground btn-hover-scale w-full rounded-xl px-4 py-2 transition-colors"
                    >
                        Cerrar Panel
                    </button>
                </PanelEdit>
            )}

            <ModalOperation isOpen={isOpen} onClose={() => setIsOpen(false)} title="Artworks">
                {/* Header */}
                <div className="bg-[#754C22] px-6 py-5">
                    <DialogTitle className="text-xl font-bold text-white">Imagenes</DialogTitle>
                    <p className="mt-1 text-sm text-white/70">Selecciona una carpeta para gestionar su catálogo</p>
                </div>

                {/* Grid de carpetas */}
                <div className="scrollbar-gutter-stable max-h-[60vh] overflow-y-auto p-6">
                    {artworks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-16">
                            <FolderOpen size={40} className="text-gray-300" />
                            <p className="text-gray-500">Aún no hay catalogo asociado</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                            {artworks.map((artwork) => (
                                <a
                                    key={artwork.id}
                                    href={route('artwork.edit', artwork.id)}
                                    className="group flex flex-col items-center gap-2 rounded-2xl bg-[#f5ecd8] p-4 transition-all duration-150 hover:-translate-y-1 hover:bg-[#e8d9b8]"
                                >
                                    <Folder
                                        size={44}
                                        className="text-[#a3792f] transition-transform duration-200 group-hover:scale-110"
                                        fill="currentColor"
                                        fillOpacity={0.2}
                                    />
                                    <div className="w-full text-center">
                                        <h3 className="truncate text-sm font-bold text-gray-800">{artwork.title}</h3>
                                        <span className="mt-0.5 inline-block rounded-full bg-black/10 px-2 py-0.5 text-[9px] tracking-wide text-gray-500 uppercase">
                                            {artwork.code}
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </ModalOperation>
        </BlogLayout>
    );
}

export default show;
