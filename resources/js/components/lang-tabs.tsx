import { BlocSelectTabs, BlocTabs } from '@/blocs/bloc-manage-info'
import { Lang, useLangStore } from '@/store/lang-store'


export const LABELS = ["es", "en", "default"] as const
export type LABELS_TYPE = typeof LABELS[number]
export type LANG_TYPES = LABELS_TYPE

export const TABS: {
    es: {
        TABS: readonly LABELS_TYPE[];
        TAB_LABEL: Record<LABELS_TYPE, string>;
    },
    en: {
        TABS: readonly LABELS_TYPE[];
        TAB_LABEL: Record<LABELS_TYPE, string>;
    }
} = {
    es: {
        TABS: LABELS,
        TAB_LABEL: {
            default: "Defecto",
            es: "ES",
            en: "EN",
        },
    },
    en: {
        TABS: LABELS,
        TAB_LABEL: {
            default: "Default",
            es: "ES",
            en: "EN",
        },
    }
};


/** Nombre completo de cada pestaña, para la etiqueta del campo ("Título · Español") */
export const LANG_NAMES: Record<Lang, Record<LANG_TYPES, string>> = {
    es: { default: "Por defecto", es: "Español", en: "Inglés" },
    en: { default: "Default", es: "Spanish", en: "English" },
}

/** Pestañas a mostrar: primero el idioma del usuario y "default" (si aplica) al final */
export const orderLangTabs = (lang: Lang, noDefault = false): LANG_TYPES[] =>
    LABELS
        .filter((l) => !noDefault || l !== "default")
        .sort((a, b) => Number(b === lang) - Number(a === lang))

interface LangTabsProps {
    /** Pestañas a mostrar, en orden (ver orderLangTabs) */
    tabs: readonly LANG_TYPES[]
    /** Pestaña activa (controlada por el padre) */
    value: LANG_TYPES
    onChange: (lang: LANG_TYPES) => void
    /** Insignia por pestaña (p. ej. nº de errores). Sin valor no se pinta */
    badges?: Partial<Record<LANG_TYPES, number>>
    className?: string
}

/**
 * Pestañas de idioma para campos traducibles. Controladas.
 * Las etiquetas siguen el idioma de la interfaz, no la pestaña activa.
 * BlocTabs en escritorio, BlocSelectTabs en móvil (mismo valor y mismas insignias).
 */
function LangTabs({ tabs, value, onChange, badges, className }: LangTabsProps) {

    const uiLang = useLangStore((l) => l.lang)
    const labels = TABS[uiLang].TAB_LABEL

    return (
        <div className={className}>
            <BlocTabs
                className="hidden md:block h-full w-full font-bold"
                labels={labels}
                tabs={tabs}
                value={value}
                onChange={onChange}
                badges={badges}
            />

            <BlocSelectTabs
                className="md:hidden h-full w-full flex items-center"
                labels={labels}
                tabs={tabs}
                value={value}
                onChange={onChange}
                badges={badges}
            />
        </div>
    )
}

export default LangTabs
