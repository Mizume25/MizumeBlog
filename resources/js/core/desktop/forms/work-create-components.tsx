/**
 * @fileoverview Componentes del formulario de creación / edición de works
 */

import LangFields from "@/components/lang-fields"
import { WORK_CREATE_TYPE } from "@/constants/work-create-constants"
import { CreateWorkInput } from "@/types"
import { Book, Pencil } from "lucide-react"
import { FieldErrors, UseFormRegister } from "react-hook-form"

interface WorkLangFieldsProps {
    DATA: WORK_CREATE_TYPE
    register: UseFormRegister<CreateWorkInput>
    errors: FieldErrors<CreateWorkInput>
    /** formState.submitCount: al enviar, salta a la pestaña que tenga errores */
    submitCount: number
}

/**
 * Campos traducibles del work:
 * - Título: con "Por defecto", que rellena al enviar los idiomas vacíos.
 * - Sinopsis: solo ES | EN; el idioma que falte no se copia.
 */
export const WorkLangFields = ({ DATA, ...form }: WorkLangFieldsProps) => (
    <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 items-start">
        <LangFields
            form={form}
            note={DATA.hints.one_language}
            fields={[
                { name: 'title', label: DATA.labels.title, icon: Book, hint: DATA.hints.title, autoFocus: true },
            ]}
        />

        <LangFields
            form={form}
            noDefault
            note={DATA.hints.one_language}
            fields={[
                { name: 'sinopsi', type: 'textarea', label: DATA.labels.sinopsi, icon: Pencil, hint: DATA.hints.sinopsi },
            ]}
        />
    </section>
)
