import { LucideIcon } from "lucide-react"





export type WorkOrder = "date" | "alpha"

export type NAV_VALUES_TYPE = 'todos' | 'literatura' | 'animemanga'

export type MEDIUM_VALUES_TYPE =
    "todos" | "libro" | "poema" | "novela_ligera" | "novela" | "anime" | "manga" | "pelicula"

export type LITERATURA = Exclude<MEDIUM_VALUES_TYPE, "novela_ligera" | "anime" | "manga" | "pelicula">

export type ANIMEMANGA = Exclude<MEDIUM_VALUES_TYPE, "libro" | "poema" | "novela">




/** Valores de Filtrado */
export type CategorySelect = "todos" | "all" | "literatura" | "literature" | "animemanga"

/** Filtros activos devueltos por WorkController (ya validados) */
export interface WorkFilters {
    category?: Exclude<NAV_VALUES_TYPE, 'todos'>
    search?: string
    tags?: (number | string)[]
    medium?: Exclude<MEDIUM_VALUES_TYPE, 'todos'>
}


