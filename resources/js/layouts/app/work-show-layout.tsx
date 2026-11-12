/**
 * @fileoverview Layout persistente del show de un work.
 *
 * Las páginas works/show/{index,post,comments,reports} lo declaran con
 * `Page.layout = WorkShowLayout`. Inertia lo mantiene montado mientras se navega
 * entre ellas: la card del work, la barra de pestañas, el aside y sus animaciones
 * no se reinician; solo cambia {children} (la página de la entidad).
 *
 * Inertia le pasa las mismas props que a la página: de ahí salen `work` y `post`.
 * Lo que solo conoce la página (índice del markdown, progreso, selector de secciones)
 * lo inyecta ella con useWorkShowSlots.
 */

import { createContext, DependencyList, PropsWithChildren, ReactNode, useContext, useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { motion, useReducedMotion } from 'motion/react';

import { BlogLayout } from '@/layouts/app';
import { BlogShow } from '@/layouts/app/blog-show';
import { ROUTE } from '@/constants/routes';
import { DATA_WORK_SHOW } from '@/constants/work-show-constants';
import { DATA_ENTITIES } from '@/core/desktop/utils-components';
import {
    WorkShowAsideBack,
    PostHeader,
    PostSidebar,
    SmoothCollapse,
    WorkShowAsideHeader,
    WorkShowHeader,
    WorkShowMain,
    WorkShowTabsBar,
} from '@/core/desktop/work-show-components';
import { COMMENTS_CACHE_TAG } from '@/hooks/custom/use-comments';
import { useLangStore } from '@/store/lang-store';
import { TurtleService } from '@/custom/services';
import { Route } from '@/types';
import { PostManageTab, WorkShowContextProps } from '@/types/custom/work-show-types';

/* ───────────────────────────── Slots ───────────────────────────── */

/** Huecos del layout que rellena la página activa */
export interface WorkShowSlots {
    /** Contenido del aside (sin él: mensaje vacío con tortuga) */
    aside?: ReactNode,
    /** Encima del main, sticky (p. ej. PageProgress) */
    top?: ReactNode,
    /** Al final de la cabecera del post (p. ej. selector de secciones) */
    headerExtra?: ReactNode,

    head?: ReactNode
}

const SlotsContext = createContext<(slots: WorkShowSlots) => void>(() => { });

/**
 * La página registra sus slots; se vacían solos al desmontarse (cambiar de pestaña).
 * `deps` decide cuándo se vuelven a enviar (p. ej. al cambiar de sección).
 */
export function useWorkShowSlots(slots: WorkShowSlots, deps: DependencyList) {
    const setSlots = useContext(SlotsContext);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { setSlots(slots); }, deps);

    useEffect(() => () => setSlots({}), [setSlots]);
}

/* ───────────────────────────── Pestañas ───────────────────────────── */

/** Página de Inertia → pestaña activa */
const COMPONENT_TAB: Record<string, PostManageTab> = {
    'works/show/post': 'posts',
    'works/show/comments': 'comments',
    'works/show/reports': 'reports',
};

/** Pestaña → ruta de Laravel */
const TAB_ROUTE: Record<PostManageTab, string> = {
    posts: 'works.posts.show',
    comments: 'works.posts.comments',
    reports: 'works.posts.reports',
};

/* ───────────────────────────── Layout ───────────────────────────── */

export default function WorkShowLayout({ children, work, post }: PropsWithChildren<WorkShowContextProps>) {

    const lang = useLangStore((l) => l.lang);

    const { component } = usePage();

    const reduce = useReducedMotion();

    const [slots, setSlots] = useState<WorkShowSlots>({});

    const DATA = DATA_WORK_SHOW[lang];

    const WORK = DATA_ENTITIES[lang].work;

    /** Hay un post abierto (páginas posts / comments / reports) */
    const open = !!post;

    /** Último post abierto: mantiene la cabecera pintada mientras se pliega al volver al listado */
    const [lastPost, setLastPost] = useState(post);
    if (post && post !== lastPost) setLastPost(post);

    const active = COMPONENT_TAB[component] ?? 'posts';

    const tabUrl = (tab: PostManageTab) => route(TAB_ROUTE[tab], [work.slug, post!.id]);

    const onTab = (tab: PostManageTab) => {
        if (tab !== active) router.visit(tabUrl(tab), { preserveScroll: true });
    };

    /**
     * Prefetch de las otras pestañas: cambiar de pestaña sale de caché (sin petición).
     * Durante 30 s se sirve tal cual; hasta 1 min se sirve y se revalida en segundo plano.
     * Comentarios lleva etiqueta propia para invalidarla tras escribir (useComments).
     */
    useEffect(() => {
        if (!post) return;

        (Object.keys(TAB_ROUTE) as PostManageTab[])
            .filter((tab) => tab !== active)
            .forEach((tab) => router.prefetch(
                tabUrl(tab),
                { method: 'get' },
                { cacheFor: ['30s', '1m'], cacheTags: tab === 'comments' ? COMMENTS_CACHE_TAG : [] },
            ));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [post?.id, active]);

    const routes: Route[] = [
        { label: 'Home', url: ROUTE.main },
        { label: 'Works', url: ROUTE.work.index },
        { label: work.title, url: route('works.show', work.slug) },
        ...(post ? [{ label: post.title, url: tabUrl('posts') }] : []),
    ];

 
    return (
        <BlogLayout routes={routes}>
            <SlotsContext.Provider value={setSlots}>
                <BlogShow
                    asideTitle={post?.title ?? ''}
                    aside={slots.aside ?? <PostSidebar DATA={DATA} />}
                    header={<WorkShowHeader work={work} WORK={WORK} collapsed={open} />}
                    subheader={<WorkShowTabsBar show={open} active={active} onTab={onTab} DATA={DATA} post={post} />}
                    asideHeader={
                        <WorkShowAsideHeader show={open}>
                            <div className="flex flex-row justify-between items-center gap-4 ">
                                <WorkShowAsideBack text={DATA.postManage.back} href={route('works.show', work.slug)} />
                            </div>
                        </WorkShowAsideHeader>
                    }
                >
                    {slots.top}

                    <WorkShowMain>
                        <SmoothCollapse show={open && active === 'posts'}>
                            {lastPost && <PostHeader post={lastPost}>{slots.headerExtra}</PostHeader>}
                        </SmoothCollapse>

                        {/* Entrada suave de cada página; el layout (y su estado) no se toca */}
                        <motion.div
                            key={component}
                            initial={reduce ? false : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {children}
                        </motion.div>
                    </WorkShowMain>
                </BlogShow>
            </SlotsContext.Provider>
        </BlogLayout>
    );
}
