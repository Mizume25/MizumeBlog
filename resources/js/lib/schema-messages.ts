/**
 * @fileoverview Mensajes de error GENÉRICOS de los schemas Zod, multilenguaje.
 *
 * No hay mensajes por campo: solo reglas (mínimo/máximo de caracteres, de elementos,
 * tamaño y tipo de archivo) con su límite como parámetro. Un campo nuevo no necesita
 * mensajes nuevos: se construye con los helpers (zText, zList, zFiles).
 *
 * Cómo viaja el mensaje:
 *   schema     msg('max_chars', { n: 255 })  →  "max_chars?n=255"   (lo guarda react-hook-form)
 *   InputError translateMessage(...)         →  "Máximo 255 caracteres" en el idioma activo
 * Al cambiar de idioma los errores visibles se traducen al momento, sin volver a validar.
 *
 * Los mensajes por defecto de Zod (tipo inválido, etc.) los traduce setZodLocale (lang-store).
 * Los errores del servidor (FormRequest) ya llegan traducidos y se muestran tal cual.
 * Los límites deben coincidir con las reglas del FormRequest correspondiente.
 */

import { z } from 'zod';
import type { Lang } from '@/store/lang-store';

type Params = Record<string, string>
type Message = string | ((p: Params) => string)

const es = {
    required: 'Campo obligatorio',
    min_chars: (p: Params) => `Mínimo ${p.n} caracteres`,
    max_chars: (p: Params) => `Máximo ${p.n} caracteres`,
    min_items: (p: Params) => `Selecciona al menos ${p.n}`,
    max_items: (p: Params) => `Máximo ${p.n} elementos`,
    max_size: (p: Params) => `Cada archivo debe pesar como máximo ${p.n}MB`,
    file_ext: (p: Params) => `El archivo debe tener extensión .${p.ext}`,
    file_type: 'Formato de archivo no válido',
    one_language: 'Rellénalo al menos en un idioma',
} satisfies Record<string, Message>

// Tipado contra `es`: si falta o sobra una clave en `en`, falla al compilar
const en: typeof es = {
    required: 'Required field',
    min_chars: (p) => `At least ${p.n} characters`,
    max_chars: (p) => `At most ${p.n} characters`,
    min_items: (p) => `Select at least ${p.n}`,
    max_items: (p) => `At most ${p.n} items`,
    max_size: (p) => `Each file must weigh ${p.n}MB at most`,
    file_ext: (p) => `The file must have a .${p.ext} extension`,
    file_type: 'Invalid file format',
    one_language: 'Fill it in at least one language',
}

export const SCHEMA_TEXT: Record<Lang, typeof es> = { es, en }
export type SchemaMsg = keyof typeof es

const isSchemaMsg = (value: string): value is SchemaMsg => Object.hasOwn(es, value)

/** Mensaje para un schema: clave + parámetros serializados ("max_chars?n=255") */
export const msg = (key: SchemaMsg, params?: Record<string, string | number>): string => {
    if (!params) return key
    const query = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]))
    return `${key}?${query}`
}

/**
 * Traduce un mensaje de schema al idioma activo.
 * Cualquier otro texto (servidor, mensajes por defecto de Zod) se devuelve tal cual.
 */
export const translateMessage = (message: string, lang: Lang): string => {
    const [key, query = ''] = message.split('?', 2)
    if (!isSchemaMsg(key)) return message

    const entry: Message = SCHEMA_TEXT[lang][key]
    return typeof entry === 'function' ? entry(Object.fromEntries(new URLSearchParams(query))) : entry
}

/** Idioma de los mensajes por defecto de Zod; se llama al hidratar y al cambiar de idioma */
export const setZodLocale = (lang: Lang): void => {
    z.config(lang === 'es' ? z.locales.es() : z.locales.en())
}

/* ───────────── Helpers: reglas habituales con su mensaje ya puesto ───────────── */

/** Texto con longitud mínima y máxima (min 1 = obligatorio) */
export const zText = (min: number, max: number) =>
    z.string()
        .min(min, min === 1 ? msg('required') : msg('min_chars', { n: min }))
        .max(max, msg('max_chars', { n: max }))

/** Texto de un idioma: vacío permitido; si tiene contenido, respeta min/max */
const zLangText = (min: number, max?: number) => {
    let s = z.string().trim()
    if (max) s = s.max(max, msg('max_chars', { n: max }))
    return s
        .refine((v) => v === '' || v.length >= min, msg('min_chars', { n: min }))
        .optional()
}

/**
 * Campo traducible { es, en }: obligatorio en al menos un idioma, sin importar cuál.
 * El idioma que falte no se copia: al leer se usa el fallback.
 * Debe coincidir con required_without del FormRequest.
 */
export const zTranslatable = (min: number, max?: number) =>
    z.object({
        es: zLangText(min, max),
        en: zLangText(min, max),
    })
        .refine((v) => Boolean(v.es || v.en), msg('one_language'))
        // No enviar "" al servidor: un idioma vacío no debe guardarse como traducción
        .transform((v) => Object.fromEntries(
            Object.entries(v).filter(([, text]) => text)
        ) as { es?: string; en?: string })

/**
 * Campo traducible con valor común { default, es, en }, para textos iguales en ambos
 * idiomas (p. ej. "Naruto"). "default" solo existe en el formulario: rellena los
 * idiomas vacíos y no se envía.
 */
export const zTranslatableWithDefault = (min: number, max?: number) =>
    z.object({
        default: zLangText(min, max),
        es: zLangText(min, max),
        en: zLangText(min, max),
    })
        .refine((v) => Boolean(v.default || v.es || v.en), msg('one_language'))
        // No enviar "" al servidor: un idioma vacío no debe guardarse como traducción
        .transform(({ default: fallback, es, en }) => Object.fromEntries(
            Object.entries({ es: es || fallback, en: en || fallback }).filter(([, text]) => text)
        ) as { es?: string; en?: string })

/** Lista con número mínimo y máximo de elementos */
export const zList = <T extends z.ZodType>(item: T, min: number, max: number) =>
    z.array(item)
        .min(min, msg('min_items', { n: min }))
        .max(max, msg('max_items', { n: max }))

export const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

interface FilesRule {
    /** Tamaño máximo de CADA archivo, en MB */
    maxMB: number
    /** MIME permitidos ('' = el navegador no lo detecta, p. ej. .md en Windows) */
    types?: readonly string[]
    /** Extensión obligatoria, sin punto */
    ext?: string
}

/** FileList opcional (uno o varios archivos): cada archivo debe cumplir la regla */
export const zFiles = ({ maxMB, types, ext }: FilesRule) =>
    z.instanceof(FileList)
        .refine((files) => Array.from(files).every((f) => !ext || f.name.toLowerCase().endsWith(`.${ext}`)), msg('file_ext', { ext: ext ?? '' }))
        .refine((files) => Array.from(files).every((f) => f.size <= maxMB * 1024 * 1024), msg('max_size', { n: maxMB }))
        .refine((files) => Array.from(files).every((f) => !types || types.includes(f.type)), msg('file_type'))
        .optional()
