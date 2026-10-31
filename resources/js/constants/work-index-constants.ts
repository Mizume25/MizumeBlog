/**
 * @fileoverview Constantes de works
 */

import { MEDIUM_VALUES_TYPE, NAV_VALUES_TYPE, WorkOrder } from "@/types/custom/work-index-types"
import { Tag } from "@/types/definitions"
import { ArrowDownZA, CalendarCheck2 } from "lucide-react"

/**
 * Valores de filtrado: coinciden con los enums del backend (WorkCategory / WorkMedium),
 * por eso no se traducen. Solo se traducen las etiquetas.
 */
const NAV_VALUES: NAV_VALUES_TYPE[] = ['todos', 'literatura', 'animemanga']
const SELECT_VALUES: MEDIUM_VALUES_TYPE[] = ["todos", "libro", "poema", "novela_ligera", "novela", "anime", "manga", "pelicula"]
const LITERATURA_VALUES: MEDIUM_VALUES_TYPE[] = ["todos", "libro", "poema", "novela"]
const ANIMEMANGA_VALUES: MEDIUM_VALUES_TYPE[] = ["todos", "novela_ligera", "anime", "manga", "pelicula"]


/**
 * Meta Objeto aglomerado
 */

export const DATA_WORK_INDEX = {
    es: {
        main_title: "Opciones de Filtrados",
        NAV_VALUES,
        SELECT_VALUES,
        LITERATURA_VALUES,
        ANIMEMANGA_VALUES,
        NAV_LABELS: {
            todos: "todos",
            literatura: "literatura",
            animemanga: "animemanga",
        } as Record<NAV_VALUES_TYPE, string>,
        MEDIUM_LABELS: {
            todos: "todos",
            libro: "libro",
            poema: "poema",
            novela_ligera: "novela ligera",
            novela: "novela",
            anime: "anime",
            manga: "manga",
            pelicula: "película",
        } as Record<MEDIUM_VALUES_TYPE, string>,
        filter: {
            tag: "Tags",
            category: "Categorias",
            orderBy: {
                title: "Ordenar por",
                types: [
                    {
                        type: "date" as WorkOrder,
                        label: "Fecha",
                        icon: CalendarCheck2
                    },
                    {
                        type: "alpha" as WorkOrder,
                        label: "Alfabetico",
                        icon: ArrowDownZA
                    },
                ]
            },
            medium: "Medio",
            search: {
                label: "Buscador",
                placeholder: "Buscar Obras..."
            },
            apply: "Aplicar",
            reset: "Resetear",
            selectTag: "Tags Selecionados"
        },
        values: {
            category: "todos",
            tags: []
        }
    },
    en: {
        main_title: "Filter Options",
        NAV_VALUES,
        SELECT_VALUES,
        LITERATURA_VALUES,
        ANIMEMANGA_VALUES,
        NAV_LABELS: {
            todos: "all",
            literatura: "literature",
            animemanga: "animemanga",
        } as Record<NAV_VALUES_TYPE, string>,
        MEDIUM_LABELS: {
            todos: "all",
            libro: "book",
            poema: "poem",
            novela_ligera: "light novel",
            novela: "novel",
            anime: "anime",
            manga: "manga",
            pelicula: "movie",
        } as Record<MEDIUM_VALUES_TYPE, string>,
        filter: {
            tag: "Tags",
            category: "Category",
            orderBy: {
                title: "Order by",
                types: [
                    {
                        type: "date" as WorkOrder,
                        label: "Date",
                        icon: CalendarCheck2
                    },
                    {
                        type: "alpha" as WorkOrder,
                        label: "Alphabetical",
                        icon: ArrowDownZA
                    },
                ]
            },
            medium: "Medium",
            search: {
                label: "Search",
                placeholder: "Search Works..."
            },
            apply: "Apply",
            reset: "Reset",
            selectTag: "Select Tags"
        },
        values: {
            category: "todos",
            tags: []
        }

    }
}

export type DATA_WORK_INDEX_TYPE = typeof DATA_WORK_INDEX.es

const WorkOrderBy = [
    {
        name: "wdwd"
    }
]
