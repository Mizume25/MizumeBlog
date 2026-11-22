import FormField from '@/components/form-label'
import LangTabs, { LANG_NAMES, LANG_TYPES, orderLangTabs } from '@/components/lang-tabs'
import { useLangStore } from '@/store/lang-store'
import { type LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FieldErrors, FieldValues, get, Path, UseFormRegister } from 'react-hook-form'

/** Un campo dentro de las pestañas. Se registra como `${name}.${idioma}` */
export interface LangFieldConfig<T extends FieldValues> {
    name: Path<T>
    label: string
    type?: 'input' | 'textarea'
    icon?: LucideIcon
    placeholder?: string
    /** Nota bajo el campo */
    hint?: string
    autoFocus?: boolean
}

interface LangFieldsProps<T extends FieldValues> {
    /** Lo necesario de useForm */
    form: {
        register: UseFormRegister<T>
        errors: FieldErrors<T>
        /** formState.submitCount: al enviar, salta a la pestaña que tenga errores */
        submitCount: number
    }
    /** Campos que comparten estas pestañas */
    fields: LangFieldConfig<T>[]
    /** Quita la pestaña "Por defecto": solo ES | EN */
    noDefault?: boolean
    /** Nota común bajo el panel, visible en cualquier pestaña */
    note?: string
    /** Ancho de la pestaña en escritorio (clase completa de Tailwind) */
    tabsWidth?: string
    className?: string
}

const LABEL_CLASS = 'flex flex-row items-center gap-2 text-secondary font-bold'

/**
 * Grupo de campos traducibles con pestañas de idioma.
 * Empieza en el idioma de la interfaz, que además va primero; "Por defecto" va al final.
 * Los valores de la pestaña oculta se conservan (react-hook-form no desregistra).
 *
 * @example
 * <LangFields form={form} note="Al menos un idioma" fields={[
 *     { name: 'title', label: 'Título', icon: Book, placeholder: 'Naruto', hint: 'Título oficial' },
 * ]} />
 */
function LangFields<T extends FieldValues>({ form, fields, noDefault = false, note, tabsWidth, className }: LangFieldsProps<T>) {

    const { register, errors, submitCount } = form
    const uiLang = useLangStore((l) => l.lang)
    const tabs = orderLangTabs(uiLang, noDefault)
    const [tab, setTab] = useState<LANG_TYPES>(uiLang)

    const pathOf = (name: Path<T>, lang: LANG_TYPES) => `${name}.${lang}` as Path<T>

    /** Nº de campos con error en un idioma, para la insignia de su pestaña */
    const errorCount = (lang: LANG_TYPES) => fields.filter((f) => get(errors, pathOf(f.name, lang))).length

    const badges = Object.fromEntries(
        tabs.map((l) => [l, errorCount(l) || undefined])
    ) as Partial<Record<LANG_TYPES, number>>

    // Al enviar: si la pestaña activa no tiene errores y otra sí, se cambia a esa
    useEffect(() => {
        if (submitCount === 0 || errorCount(tab) > 0) return
        const withErrors = tabs.find((l) => errorCount(l) > 0)
        if (withErrors) setTab(withErrors)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitCount])

    return (
        <div className={className ?? 'w-full'}>
            {/* Móvil: pestaña a todo el ancho (select). Escritorio: pestaña estrecha pegada al panel */}
            <div className={`w-full ${tabsWidth ?? (noDefault ? 'md:w-45' : 'md:w-72')} h-15 bg-mizume-fourthary flex flex-row justify-center items-center p-3 md:p-4 rounded-t-xl`}>
                <LangTabs className="h-full w-full" tabs={tabs} value={tab} onChange={setTab} badges={badges} />
            </div>

            <div className="w-full h-auto p-3 md:p-4 flex flex-col gap-3 bg-mizume-fourthary rounded-b-xl md:rounded-tr-xl">
                {fields.map(({ name, label, type = 'input', icon, placeholder, hint, autoFocus }) => {
                    const path = pathOf(name, tab)
                    const control = {
                        className: 'flex flex-col gap-1',
                        labelClass: LABEL_CLASS,
                        label: `${label} · ${LANG_NAMES[uiLang][tab]}`,
                        icon,
                        placeholder,
                        autoFocus,
                        id: `${name}-${tab}`,
                        /** "default" no es un código de idioma válido para el atributo lang */
                        lang: tab === 'default' ? undefined : tab,
                        // Error del idioma o, si no, el de grupo (ningún idioma tiene valor)
                        error: get(errors, path)?.message ?? get(errors, name)?.message,
                        ...register(path),
                    }

                    return (
                        <div key={name} className="w-full flex flex-col gap-2 bg-secondary-foreground p-4 md:p-6 rounded-md">
                            {type === 'textarea'
                                ? <FormField key={path} type="textarea" {...control} />
                                : <FormField key={path} type="input" {...control} />}
                            {hint && <p className="text-xs text-secondary opacity-70">{hint}</p>}
                        </div>
                    )
                })}

                {note && <p className="text-xs text-secondary-foreground opacity-80">* {note}</p>}
            </div>
        </div>
    )
}

export default LangFields
