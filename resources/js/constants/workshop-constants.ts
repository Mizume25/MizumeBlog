/**
 * @fileoverview Constantes del taller (workshop)
 */

import { Lang } from "@/store/lang-store";
import { WorkShopTab } from "@/types/custom/workshop-types";

/**
 * Valores de las pestañas: compartidos entre idiomas para que el estado
 * no entre en conflicto al cambiar de idioma. Solo se traducen las etiquetas.
 */
export const WORKSHOP_TABS: readonly WorkShopTab[] = ["manage", "posts", "reports", "requests"]

export const WORKSHOP_POST_TABS = ["all", "publish", "pendings", "drafts"] as const
export type WORKSHOP_POST_TABS_TYPE = typeof WORKSHOP_POST_TABS[number]

/**
 * Orden de la tabla de posts del taller (?order=). Valores fijos, solo se traducen las etiquetas.
 * recent = creación · updated = última edición · title = alfabético · featured = destacados primero
 */
export const WORKSHOP_POST_ORDERS = ["recent", "updated", "title", "featured"] as const
export type WORKSHOP_POST_ORDER_TYPE = typeof WORKSHOP_POST_ORDERS[number]

export const WORKSHOP_POST_ORDER_LABELS: Record<Lang, Record<WORKSHOP_POST_ORDER_TYPE, string>> = {
    es: { recent: "Más recientes", updated: "Última edición", title: "Título (A-Z)", featured: "Destacados primero" },
    en: { recent: "Most recent", updated: "Last edited", title: "Title (A-Z)", featured: "Featured first" },
}

export const DATA_WORKSHOP: Record<Lang, {
    heads: Record<WorkShopTab, string>,
    TAB_LABELS: Record<WorkShopTab, string>,
    filter: {
        search: { title: string, placeholder: string }
        apply: string,
        reset: string,
        WORKSHOP_POST_TABS: readonly WORKSHOP_POST_TABS_TYPE[],
        POST_LABELS: Record<WORKSHOP_POST_TABS_TYPE, string>
    }
}> = {
    es: {
        heads: {
            manage: "Taller · Administrador",
            posts: "Taller · Publicaciones",
            reports: "Taller · Reportes",
            requests: "Taller · Solicitudes",
        },
        TAB_LABELS: {
            manage: "Administrador",
            posts: "Publicaciones",
            reports: "Reportes",
            requests: "Solicitudes",
        },
        filter: {
            search: {
                title: "Buscador",
                placeholder: "Buscar por titulo..."
            },
            apply: "Aplicar",
            reset: "Resetear",
            WORKSHOP_POST_TABS,
            POST_LABELS: {
                all: "Todos",
                publish: "Publicados",
                pendings: "Pendientes",
                drafts: "Borradores",
            } as Record<WORKSHOP_POST_TABS_TYPE, string>


        },
    },
    en: {
        heads: {
            manage: "Workshop · Manage",
            posts: "Workshop · Posts",
            reports: "Workshop · Reports",
            requests: "Workshop · Requests",
        },
        TAB_LABELS: {
            manage: "Manage",
            posts: "Posts",
            reports: "Reports",
            requests: "Requests",
        },
        filter: {
            search: {
                title: "Search",
                placeholder: "Search by title..."
            },
             apply: "Apply",
            reset: "Reset",
            WORKSHOP_POST_TABS,
            POST_LABELS: {
                all: "All",
                publish: "Publish",
                pendings: "Pendings",
                drafts: "Drafts",
            } as Record<WORKSHOP_POST_TABS_TYPE, string>
        },
    },
}

export type DATA_WORKSHOP_TYPE = typeof DATA_WORKSHOP.es
