/**
 * @fileoverview Layout persistente del taller (workshop).
 *
 * Las páginas panel/workshop/{manage,posts,reports,requests} lo declaran con
 * `Page.layout = WorkShopLayout`. Inertia lo mantiene montado mientras se navega
 * entre ellas: la cabecera de pestañas y su indicador no se reinician;
 * solo cambia {children} (la vista de la pestaña).
 *
 * Inertia le pasa las mismas props que a la página (WorkShopContextProps):
 * de ahí salen los `counts` de las insignias. El usuario está en auth.user (props compartidas).
 */

import { PropsWithChildren, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { motion, useReducedMotion } from 'motion/react';

import { BlogLayout } from '@/layouts/app';
import { DATA_WORKSHOP } from '@/constants/workshop-constants';
import { WorkShopHeader } from '@/core/desktop/workshop-components';
import { useLangStore } from '@/store/lang-store';
import { Route } from '@/types';
import { WorkShopContextProps, WorkShopTab } from '@/types/custom/workshop-types';

/* ───────────────────────────── Pestañas ───────────────────────────── */

/** Página de Inertia → pestaña activa */
const COMPONENT_TAB: Record<string, WorkShopTab> = {
    'panel/workshop/manage': 'manage',
    'panel/workshop/posts': 'posts',
    'panel/workshop/reports': 'reports',
    'panel/workshop/requests': 'requests',
};

/** Pestaña → ruta de Laravel */
const TAB_ROUTE: Record<WorkShopTab, string> = {
    manage: 'panel.workshop',
    posts: 'panel.workshop.posts',
    reports: 'panel.workshop.reports',
    requests: 'panel.workshop.requests',
};

/* ───────────────────────────── Layout ───────────────────────────── */

export default function WorkShopLayout({ children, counts }: PropsWithChildren<WorkShopContextProps>) {

    const lang = useLangStore((l) => l.lang);

    const { component } = usePage();

    const reduce = useReducedMotion();

    const DATA = DATA_WORKSHOP[lang];

    const active = COMPONENT_TAB[component] ?? 'manage';

    const onTab = (tab: WorkShopTab) => {
        if (tab !== active) router.visit(route(TAB_ROUTE[tab]), { preserveScroll: true });
    };

    /**
     * Prefetch de las otras pestañas: cambiar de pestaña sale de caché (sin petición).
     * Durante 30 s se sirve tal cual; hasta 1 min se sirve y se revalida en segundo plano.
     */
    useEffect(() => {
        (Object.keys(TAB_ROUTE) as WorkShopTab[])
            .filter((tab) => tab !== active)
            .forEach((tab) => router.prefetch(
                route(TAB_ROUTE[tab]),
                { method: 'get' },
                { cacheFor: ['30s', '1m'] },
            ));
    }, [active]);

    const routes: Route[] = [
        { label: 'Workshop', url: route(TAB_ROUTE.manage) },
        ...(active !== 'manage' ? [{ label: DATA.TAB_LABELS[active], url: route(TAB_ROUTE[active]) }] : []),
    ];

    return (
        <BlogLayout routes={routes}>
            <WorkShopHeader labels={DATA.TAB_LABELS} value={active} onChange={onTab} counts={counts} />

            {/* Entrada suave de cada vista; el layout (y su estado) no se toca */}
            <motion.div
                key={component}
                className="w-full"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
                {children}
            </motion.div>
        </BlogLayout>
    );
}
