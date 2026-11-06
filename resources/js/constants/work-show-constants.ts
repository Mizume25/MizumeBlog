/**
 * @fileoverview Constanes del show de works
 */

import { PostManageTab, PostOrder } from "@/types/custom/work-show-types";
import { ArrowDownZA, CalendarCheck2 } from "lucide-react";
import { DATA_WORK_INDEX } from "./work-index-constants";

/**
 * Valores de las pestañas: compartidos entre idiomas para que el estado
 * no entre en conflicto al cambiar de idioma. Solo se traducen las etiquetas.
 */
const POST_TABS: PostManageTab[] = ["posts", "comments", "reports"]


export const DATA_WORK_SHOW = {
    es: {
        search: { label: "Buscar usuario", placeholder: "Nombre del usuario..." },
        orderBy: {
            title: "Ordenar por",
            types: [
                { type: "date" as PostOrder, label: "Fecha", icon: CalendarCheck2 },
                { type: "alpha" as PostOrder, label: "Usuario (A-Z)", icon: ArrowDownZA },
            ],
        },
        apply: "Aplicar",
        reset: "Restablecer",
        postManage:{
            back:"Volver",
            POST_TABS,
            TAB_LABELS: {
                posts: "Publi.",
                comments: "Comentarios",
                reports: "Reportes",
            } as Record<PostManageTab, string>,
        },
        error:{
            withOutPosts: "No hay publicaciones disponibles"
        },
        sidebar: {
            empty: "Aquí se mostrará el índice del contenido",
            loading: "Cargando índice",
        }
    },
    en: {
        search: { label: "Search user", placeholder: "User name..." },
        orderBy: {
            title: "Order by",
            types: [
                { type: "date" as PostOrder, label: "Date", icon: CalendarCheck2 },
                { type: "alpha" as PostOrder, label: "User (A-Z)", icon: ArrowDownZA },
            ],
        },
        apply: "Apply",
        reset: "Reset",
        postManage:{
            back:"Back",
            POST_TABS,
            TAB_LABELS: {
                posts: "Posts",
                comments: "Comments",
                reports: "Reports",
            } as Record<PostManageTab, string>,
        },
        error:{
            withOutPosts: "No posts available"
        },
        sidebar: {
            empty: "The content index will appear here",
            loading: "Loading index",
        }
    },
}


export type DATA_WORK_SHOW_TYPE = typeof DATA_WORK_SHOW.es

