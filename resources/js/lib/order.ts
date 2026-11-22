/**
 * @fileoverview Orden genérico de listados en cliente (works/index, authors/index, works/show).
 *
 * Todos los listados ordenan igual: por fecha o alfabético, y se pueden invertir.
 * Lo único que cambia es QUÉ campo es la fecha o el texto de cada entidad (keys de sortByOrder)
 * y, si hace falta, alguna etiqueta (orderOptions(lang, { alpha: "Usuario (A-Z)" })).
 *
 * El taller NO usa esto: su orden va al servidor (?order=) con criterios propios
 * (WORKSHOP_POST_ORDERS en workshop-constants).
 */

import type { Lang } from "@/store/lang-store";
import { ArrowDownZA, CalendarCheck2, LucideIcon } from "lucide-react";

export const ORDER_VALUES = ["date", "alpha"] as const
export type ValueOrder = typeof ORDER_VALUES[number]

/** Orden inicial y el que restaura onReset */
export const ORDER_DEFAULT: ValueOrder = "date"

const ORDER_ICONS: Record<ValueOrder, LucideIcon> = {
    date: CalendarCheck2,
    alpha: ArrowDownZA,
}

export const ORDER_TEXT: Record<Lang, { title: string, labels: Record<ValueOrder, string> }> = {
    es: { title: "Ordenar por", labels: { date: "Fecha", alpha: "Alfabético" } },
    en: { title: "Order by", labels: { date: "Date", alpha: "Alphabetical" } },
}

export type OrderOption = { type: ValueOrder, label: string, icon: LucideIcon }

/**
 * Opciones del selector de orden en un idioma.
 * @param labels sustituye alguna etiqueta concreta (el resto sale de ORDER_TEXT)
 */
export const orderOptions = (lang: Lang, labels?: Partial<Record<ValueOrder, string>>): OrderOption[] =>
    ORDER_VALUES.map((type) => ({
        type,
        label: labels?.[type] ?? ORDER_TEXT[lang].labels[type],
        icon: ORDER_ICONS[type],
    }))

export interface OrderKeys<T> {
    /** Valor numérico de la fecha (timestamp, año...): se ordena de mayor a menor */
    date: (item: T) => number
    /** Texto para el orden alfabético (A-Z, respetando el idioma) */
    alpha: (item: T) => string
    /** Opcional: los que cumplan van siempre delante (p. ej. destacados) */
    first?: (item: T) => boolean
}

/**
 * Ordena una copia de items según el criterio. revert invierte el resultado completo.
 */
export function sortByOrder<T>(items: readonly T[], order: ValueOrder, keys: OrderKeys<T>, lang: Lang, revert = false): T[] {

    const compare = order === "date"
        ? (a: T, b: T) => keys.date(b) - keys.date(a)
        : (a: T, b: T) => keys.alpha(a).localeCompare(keys.alpha(b), lang, { sensitivity: "base" })

    const sorted = [...items].sort((a, b) =>
        (keys.first ? Number(keys.first(b)) - Number(keys.first(a)) : 0) || compare(a, b)
    )

    return revert ? sorted.reverse() : sorted
}

/** Timestamp de una fecha ISO; sin fecha (borrador) cuenta como la más antigua */
export const dateTime = (date: string | null | undefined): number => date ? new Date(date).getTime() : 0
