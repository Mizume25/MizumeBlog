/**
 * @fileoverview Constantes de authors
 */

import { AuthorOrder } from "@/types/custom/author-index-types";
import { ArrowDownZA, CalendarCheck2 } from "lucide-react";

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
                title: "Ordenar por",
                types: [
                    {
                        type: "date" as AuthorOrder,
                        label: "Fecha",
                        icon: CalendarCheck2
                    },
                    {
                        type: "alpha" as AuthorOrder,
                        label: "Alfabetico",
                        icon: ArrowDownZA
                    },
                ]
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
                title: "Order by",
                types: [
                    {
                        type: "date" as AuthorOrder,
                        label: "Date",
                        icon: CalendarCheck2
                    },
                    {
                        type: "alpha" as AuthorOrder,
                        label: "Alphabetical",
                        icon: ArrowDownZA
                    },
                ]
            },
        },

    }

}

export type DATA_AUTHOR_INDEX_TYPE = typeof DATA_AUTHOR_INDEX.es