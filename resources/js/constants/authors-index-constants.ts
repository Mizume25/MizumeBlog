/**
 * @fileoverview Constantes de authors
 */

import { ORDER_TEXT, orderOptions } from "@/lib/order";

/** Año mínimo del slider: con este valor no se aplica filtro por año */
export const AUTHOR_YEAR_MIN = -1000;

export const DATA_AUTHOR_INDEX = {
    es: {
        main_title: "Opciones de Filtrados",
        filter: {
            slider: {
                label: "Filtro por Año",
                title: "Periodo",
            },
            search: {
                label: "Buscador",
                placeholder: "Buscar Autor..."
            },
            apply: "Aplicar",
            reset: "Resetear",
            orderBy: {
                title: ORDER_TEXT.es.title,
                types: orderOptions("es"),
            },
        },

    },
    en: {
        main_title: "Filter Options",
        filter: {
            slider: {
                label: "Filter year",
                title: "Period",
            },
            search: {
                label: "Search",
                placeholder: "Search Author..."
            },
            apply: "Apply",
            reset: "Reset",
            orderBy: {
                title: ORDER_TEXT.en.title,
                types: orderOptions("en"),
            },
        },

    }

}

export type DATA_AUTHOR_INDEX_TYPE = typeof DATA_AUTHOR_INDEX.es