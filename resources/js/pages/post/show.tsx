/** @import Todos los types utilizados */
import { ArticleConfig, Artwork, BackgroundPositionKeyword, IndexContent, formatDefault, type Content } from '@/types';

/** @import Objetos Inertia */
import { Head } from '@inertiajs/react';

/** @import Iconos */
import { Folder, FolderOpen, ListTree } from 'lucide-react';

/** @import Componenetes Modal */
import ApiToast from '@/components/api-toast';
import ModalOperation from '@/components/modal-operation';
import { useToast } from '@/hooks/use-toast';
import PanelEdit from '@/layouts/app/panel-edit';
import { configApi } from '@/types/api';
import { DialogTitle } from '@headlessui/react';

/** @imports HOOKS Utilziados */
import { useCallback, useEffect, useState } from 'react';

/** @import Layouts y Componentes */
import SideBarRight from '@/core/auth/SideBarRight';
import Coments from '@/core/coments/Coments';
import PostEdit from '@/core/post/PostEdit';
import BlogLayout from '@/layouts/app/blog-layout';
import { PostContent, PostSideBarLeft } from '../../core/post';

/**
 *
 * @param routa Ruta de la imagen
 * @param title Titulo de el post
 * @param formato Formato de imagen
 * @returns
 */

export var MIN = 20;
export var MAX = 90;
export var DEFAULT_HEIGHT = 35;

/** @interface Interfaz de Encabezado */
interface PostHeaderProps {
    route: string | undefined;
    title: string;
    format: ArticleConfig | undefined;
}

/** @interface Interfaz de la Página */
interface ShowProps {
    content: Content;
    artworks: Artwork[];
}

/**
 * Componente TSX para renderizar Encabezado
 * @param route
 * @param title
 * @param format
 * @returns
 */
function PostHeader({ route, title, format }: PostHeaderProps) {
    return (
        <>
            {/* Imagen de la obra */}
            <header
                className={`hidden w-full bg-cover bg-no-repeat lg:block`}
                style={{
                    height: `${format?.height}`,
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${route})`,
                    backgroundPosition: `${format?.position}`,
                }}
            ></header>

            {/* Titulo de la obra */}
            <div className="relative z-10 -mt-10 hidden justify-center px-4 lg:flex">
                <div className="w-full max-w-4xl rounded-xl border border-[#b39a6f] bg-[#C8AD7F] py-4 text-center shadow-lg">
                    <h2 className="title text-2xl font-bold tracking-wide text-white uppercase sm:text-3xl md:text-5xl">{title.replaceAll('-', ' ')}</h2>
                </div>
            </div>
        </>
    );
}

/**
 * Boton Indice para Post
 * @param onOpen Funcion para abrir y cerrar SideBar
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

function show({ content, artworks }: ShowProps) {
    /**
     * @glob Variables de la página
     */

    /** Ruta de la Portada */
    const cover = `/IMG/Portada/${content.post.cover}`;

    /** Formato de la portada */
    const [format, setFormat] = useState<ArticleConfig | undefined>(content.post.config?.article ?? formatDefault.article);

    /** Indice de Contenido */
    const index: IndexContent[] = content.index;

    /** Punto del indice selecionado */
    const [selectedId, setSelectedId] = useState<string>('puntos-capitales');

    /** Sidebar del Indice */
    const [sidebar, setSidebar] = useState(false);

    /** Estructura de control de confirmacion de cambios */
    const [confirm, setConfirm] = useState(false);

    /** Estructura de control para abrir el imagenes */
    const [isOpen, setIsOpen] = useState(false);

    /** Estructura para abrir panel de edicion */
    const [edit, setEdit] = useState(false);

    /** Estructura para seteat la position */
    const [position, setPosition] = useState<BackgroundPositionKeyword | null>(null);

    /** Estructura para setear altura del contendor */
    const [height, setHeight] = useState(0);

    /** Iteración de indice */
    const handleFindID = (id: string) => setSelectedId(id);

    /** Hooks personalizados */
    const { showToast, toast } = useToast();

    /** Toogle de cerrado */
    const onOpen = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setSidebar((prev) => !prev);
    }, []);

    /** Cerrado de Indice */
    const isClose = () => setSidebar(false);

    /** Abrir Sidebar */
    const handlerClick = () => setIsOpen(true);

    /** Editar Panel */
    const handlerEdit = () => setEdit((prev) => !prev);

    /**
     * Funciones
     */

    /** Api para confirmar cambios */
    const ApiArticleUpdate = async () => {
        if (format == null) return;

        await configApi
            .updateArticle(Number(content.post.id), format)
            .then((data) => showToast('success', data.message))
            .catch((err) => showToast('error', err.message));

        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };

    function clamp(n: number) {
        return Math.min(MAX, Math.max(MIN, n));
    }

    /**
     * @glob HOOKS
     */

    /** Formato de la portada renderizada a estado  */
    useEffect(() => {
        setFormat(content.post.config?.article ?? undefined);
        const originalHeightRaw = content.post.config?.article?.height;
        if (originalHeightRaw == undefined) return;
        const value = parseInt(originalHeightRaw, 10);
        setHeight(value);
        setPosition((content.post.config?.article?.position as BackgroundPositionKeyword) ?? null);
    }, [content.post.id]);

    /** Setear Formato mientras cambio las variable s */
    useEffect(() => {
        setFormat((prev) => ({
            height: `${height}vh`,
            position: position ?? prev?.position ?? 'center',
        }));
    }, [position, height]);

    /**
     * Resetear Valores
     */
    useEffect(() => {
        if (!edit) {
            setPosition((content.post.config?.article?.position as BackgroundPositionKeyword) ?? null);
            const raw = content.post.config?.article?.height;
            setHeight(raw ? parseInt(raw, 10) : DEFAULT_HEIGHT);
        }
    }, [edit]);

    /**
     * Solo Activar Confirmar en caso de valores diferentes
     */
    useEffect(() => {
        const originalPosition = content.post.config?.article?.position ?? null;
        const originalHeightRaw = content.post.config?.article?.height;
        const originalHeight = originalHeightRaw ? parseInt(originalHeightRaw, 10) : DEFAULT_HEIGHT;

        const positionChanged = position != null && position !== originalPosition;
        const heightChanged = height !== originalHeight;

        setConfirm(positionChanged || heightChanged);
    }, [position, height]);

    const onChange = (n: number) => clamp(Number(n));
    const onPlus = () => setHeight((h: number) => clamp(h + 1));
    const onRest = () => setHeight((h: number) => clamp(h - 1));
    const onReset = () => setHeight(DEFAULT_HEIGHT);
    const onPosition = (ps: BackgroundPositionKeyword) => setPosition(ps);

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
                    <PostEdit
                        height={height}
                        onChange={onChange}
                        onClose={() => setEdit(false)}
                        onPlus={onPlus}
                        onConfirm={ApiArticleUpdate}
                        onPosition={onPosition}
                        onReset={onReset}
                        onRest={onRest}
                    />

                   
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
