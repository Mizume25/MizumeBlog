/**
 * @fileoverview Constantes de works
 */

/**
 * Meta Objeto aglomerado 
 */

export const DATA_WORK_INDEX = {
    es: {
        NAV_VALUES: ['todos', 'literatura', 'animemanga'],
        SELECT_VALUES: ["todos","libro", "poema", "novela_ligera", "novela", "anime", "manga", "pelicula"],
        LITERATURA_VALUES: ["todos","libro", "poema", "novela"],
        ANIMEMANGA_VALUES: ["todos","novela_ligera", "anime", "manga", "pelicula"],
        filter:{
            tag: "Tags",
            category: "Categorias",
            publish_date: "Fecha",
            medium: "Medio",
            search: "Buscador"
        }
    },
    en: {
        NAV_VALUES: ['all', 'literature', 'animemanga'],
        SELECT_VALUES: ["all", "book", "poem", "light_novel", "novel", "anime", "manga", "movie"],
        LITERATURA_VALUES: ["all", "book", "poem", "novela"],
        ANIMEMANGA_VALUES: ["all", "light_novel", "anime", "manga", "movie"],
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

