/**
 * @fileoverview Constantes de la mediateca
 */

/** Valores del filtro de tipo: coinciden con las colecciones de Spatie, por eso no se traducen */
export const MEDIA_TYPE_VALUES = ["all", "cover", "profile", "gallery"] as const

export type MediaTypeValue = (typeof MEDIA_TYPE_VALUES)[number]

/**
 * Meta Objeto aglomerado
 */
export const DATA_MEDIA = {
    es: {
        filter: {
            search_name: {
                label: "Nombre de imagen",
                placeholder: "Buscar por nombre...",
            },
            search_artist: {
                label: "Artista",
                placeholder: "Buscar por artista...",
            },
            work: {
                label: "Obra",
                placeholder: "Selecciona una obra",
            },
            type: "Tipo",
            apply: "Aplicar",
            reset: "Resetear",
        },
        TYPE_LABELS: {
            all: "todos",
            cover: "portada",
            profile: "autor",
            gallery: "galería",
        } as Record<MediaTypeValue, string>,
        card: {
            credit: "Arte de",
        },
        err: {
            withOutMedia: "No hay imágenes disponibles",
        },
    },
    en: {
        filter: {
            search_name: {
                label: "Image name",
                placeholder: "Search by name...",
            },
            search_artist: {
                label: "Artist",
                placeholder: "Search by artist...",
            },
            work: {
                label: "Work",
                placeholder: "Select a work",
            },
            type: "Type",
            apply: "Apply",
            reset: "Reset",
        },
        TYPE_LABELS: {
            all: "all",
            cover: "cover",
            profile: "author",
            gallery: "gallery",
        } as Record<MediaTypeValue, string>,
        card: {
            credit: "Art by",
        },
        err: {
            withOutMedia: "No images available",
        },
    },
}

export type DATA_MEDIA_TYPE = (typeof DATA_MEDIA)["es"]

export type MediaType = "cover" | "profile" | "gallery"

export type MediaFilter = {
    type: MediaType | null,
    search_name: string | null,
    search_artist: string  | null,
    work: string | null,
}