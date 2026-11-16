/**
 * @fileoverview Types del taller (workshop) de editores y administradores
 */
import { Paginated, PostRecord } from "../definitions"

/** Pestañas del taller: valores fijos, no se traducen (solo sus labels) */
export type WorkShopTab = "manage" | "posts" | "reports" | "requests"

/* ───────────── Props de las páginas que comparten WorkShopLayout ───────────── */

/** Props comunes: las recibe también el layout (Inertia le pasa las props de la página) */
export interface WorkShopContextProps {
    /** Número representativo de cada pestaña (se muestra como insignia) */
    counts: Record<WorkShopTab, number>,
}

/** panel/workshop/manage: resumen de actividad */
export interface WorkShopManageProps extends WorkShopContextProps {
    posts: PostRecord[],
}

export interface StatsPosts {
    publish: number,
    pending:number,
    drafts: number
    comments: number,
} 


export interface WorkShopPostsFilter {
    /** Ausente cuando no hay búsqueda (el backend manda {}) */
    search?: string
}

/** panel/workshop/posts */
export interface WorkShopPostsProps extends WorkShopContextProps {
    paginated: Paginated<PostRecord>,
    stats: StatsPosts,
    filter: WorkShopPostsFilter
}

/** panel/workshop/reports */
export type WorkShopReportsProps = WorkShopContextProps

/** panel/workshop/requests */
export type WorkShopRequestsProps = WorkShopContextProps
