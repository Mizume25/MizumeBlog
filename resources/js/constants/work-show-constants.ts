/**
 * @fileoverview Constanes del show de works
 */

import { PostManageTab } from "@/types/custom/work-show-types";
import { ORDER_TEXT, orderOptions } from "@/lib/order";
import { DATA_WORK_INDEX } from "./work-index-constants";

/**
 * Valores de las pestañas: compartidos entre idiomas para que el estado
 * no entre en conflicto al cambiar de idioma. Solo se traducen las etiquetas.
 */
const POST_TABS: PostManageTab[] = ["posts", "comments", "reports"]


export const DATA_WORK_SHOW = {
    es: {
        heads:{
            index: "Publicaciones",
            comments: "Comentarios",
            reports:"Reportes"
        },
        search: { label: "Buscar post", placeholder: "Título o autor del post..." },
        orderBy: {
            title: ORDER_TEXT.es.title,
            types: orderOptions("es", { alpha: "Usuario (A-Z)" }),
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
        heads:{
            index: "Works",
            comments: "Comments",
            reports:"Reports"
        },
        search: { label: "Search post", placeholder: "Post title or author..." },
        orderBy: {
            title: ORDER_TEXT.en.title,
            types: orderOptions("en", { alpha: "User (A-Z)" }),
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

