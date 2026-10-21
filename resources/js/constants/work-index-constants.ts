/**
 * @fileoverview Constantes de works
 */

import { MEDIUM_VALUES_TYPE, NAV_VALUES_TYPE } from "@/types/custom/work-index-types"

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
        filter:{
            tag: "Tags",
            category: "Categorias",
            publish_date: "Fecha",
            medium: "Medio",
            search: "Buscador"
        }
    },
    en: {
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
        filter:{
            tag: "Tags",
            category: "Category",
            publish_date: "Date",
            medium: "Medium",
            search: "Search"
        }
    }
}

export type DATA_WORK_INDEX_TYPE = typeof DATA_WORK_INDEX.es
