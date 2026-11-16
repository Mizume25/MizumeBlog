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

export const DATA_WORKSHOP: Record<Lang, {
    heads: Record<WorkShopTab, string>,
    TAB_LABELS: Record<WorkShopTab, string>,
    filter: {
        search: { title: string, placeholder: string }
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
        },
    },
}

export type DATA_WORKSHOP_TYPE = typeof DATA_WORKSHOP.es
