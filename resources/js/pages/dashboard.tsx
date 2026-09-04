/** @import Types Utilizados */
import { BackgroundPositionKeyword, type Post } from '@/types';

/** @imports Inertia Objetcts */
import { Head } from '@inertiajs/react';

/** @imports Objeto de peticiones Api */
import { configApi } from '@/types/api';

/** @import COMPONENTES */
import ApiToast from '@/components/api-toast';
import SideBarRight from '@/core/auth/SideBarRight';
import BlogLayout from '@/layouts/app/blog-layout';
import PanelEdit from '@/layouts/app/panel-edit';
import { HomeContent } from '../core/home';

/** @import HOOKS UTILIZADOS */
import HomeEdition from '@/core/home/HomeEdition';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useMemo, useState } from 'react';

/**
 * Funciones Estaticas
 * @param id
 * @returns Post
 */

const getPost = (posts: Post[], id: number | null) => {
    if (id == null) return;
    return posts.find((p) => p.id === id);
};

export default function Dashboard({ posts }: { posts: Post[] }) {
    /***
     * Conteido Destacado
     * Dividmos el contendo 3
     */
    const { mainPosts, sidebarPosts } = useMemo(() => {
        return {
            mainPosts: posts.slice(0, 3),
            sidebarPosts: posts.slice(3),
        };
    }, [posts]);

    /**+
     * @glob Vairables globales
     */
    /** Variable de estructura de control para activar edicion de imagen */
    const [edit, setEdit] = useState(false);

    /** Estructura de control para conirmar cambios */
    const [confirmPosition, setConfirmPosition] = useState(false);

    /** Estructura para almacenar posiciones */
    const [position, setPosition] = useState<BackgroundPositionKeyword | null>(null);

    /** Estructura para almacenar Post utilizado */
    const [selectPost, setSelectPost] = useState<number | null>(null);

    /** Variables del hook personal toast */
    const { showToast, toast } = useToast();

    /**
     * @glob Funciones de toda la página
     */

    /** Activar y Desactivar propiedades */
    const handlerEdit = () => {
        const newEdit = !edit;

        setEdit(newEdit);

        if (newEdit) {
            setSelectPost(mainPosts[0].id);
        } else {
            setSelectPost(null);
        }
    };

    /** Api que realiza el update */
    const ApiHomeUpdate = async () => {
        if (position == null) return;

        await configApi
            .updateHome(Number(selectPost), position)
            .then((data) => showToast('success', data.message))
            .catch((err) => showToast('error', err.message));

        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };

    /**
     * @glob HOOKS y RENDERS
     */

    /** Cambiar el formato del post cuando se cambie de post */
    useEffect(() => {
        const post = getPost(posts, selectPost);
        setPosition((post?.config?.home as BackgroundPositionKeyword) ?? 'top');
    }, [selectPost]);

    /**
     * Permitir confirmar cambios solo en caso de introducir valores diferentes
     */
    useEffect(() => {
        const post = getPost(posts, selectPost);
        setConfirmPosition((post?.config?.home as BackgroundPositionKeyword) !== position);
    }, [position]);

    const onPosition = (ps: BackgroundPositionKeyword) => setPosition(ps);
    const onPost = (post: number) => setSelectPost(post);

    return (
        <BlogLayout edit={edit} onEdit={handlerEdit}>
            {/* Head de el Home*/}
            <Head title="Home"></Head>
            <ApiToast toast={toast} />
            <main className="container mx-auto grid max-w-[1500px] grid-cols-1 items-start gap-8 p-4 md:p-8 lg:grid-cols-[2fr_1fr]">
                <HomeContent mainPosts={mainPosts} className="order-2 lg:order-1" selectPost={selectPost} position={position} edit={edit} />

                <SideBarRight posts={sidebarPosts} showFollow sticky="lg:top-6" className="order-1 lg:order-2" />
            </main>

            {edit && (
                <PanelEdit>
                    <HomeEdition
                        mainPosts={mainPosts}
                        position={position}
                        confirmPosition={confirmPosition}
                        selectPost={selectPost}
                        onConfirm={ApiHomeUpdate}
                        onPosition={onPosition}
                        onClose={() => setEdit(false)}
                        onPost={onPost}
                    />

                    {/*
                    
                    <p className="mb-4 text-sm text-white dark:text-gray-100">Configura las opciones del layout aquí.</p>

                    <select
                        className="mb-5 w-full cursor-pointer rounded-xl bg-amber-100 p-2 text-black capitalize outline-none focus:bg-amber-200"
                        value={selectPost ?? ''}
                        onChange={(e) => setSelectPost(Number(e.target.value))}
                    >
                        {mainPosts.map((p, i) => (
                            <option key={p.id} value={p.id} className="bg-white text-black">
                                {p.title}
                            </option>
                        ))}
                    </select>

                    <h3 className="mb-2 text-lg font-bold text-white">Posicion</h3>
                    <select
                        className={`mb-5 w-full cursor-pointer rounded-xl bg-amber-100 p-2 text-black capitalize outline-none focus:bg-amber-200 disabled:bg-amber-200/20`}
                        value={position ?? ''}
                        onChange={(e) => setPosition(e.target.value as BackgroundPositionKeyword)}
                    >
                        {BackgroundOptions.map((p, i) => (
                            <option key={i} value={p} className="bg-white text-black">
                                {p}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={ApiHomeUpdate}
                        className="bg-btn-success text-btn-success-foreground mb-2 w-full rounded-xl px-4 py-2 transition-colors not-disabled:cursor-pointer disabled:bg-white/60"
                        disabled={!confirmPosition}
                    >
                        Confirmar Posicion
                    </button>

                    <button
                        onClick={() => setEdit(false)}
                        className="bg-btn-info text-btn-info-foreground btn-hover-scale w-full rounded-xl px-4 py-2 transition-colors"
                    >
                        Cerrar Panel
                    </button>
                    */}
                </PanelEdit>
            )}
        </BlogLayout>
    );
}
