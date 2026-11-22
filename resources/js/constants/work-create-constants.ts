

/**
 * 
 * @fileoverview Constatnes del formulario
 */
export const WORK_CREATE = {
    es: {
        head: "Crear Obra",
        labels: {
            title: "Título",
            sinopsi: "Sinopsis",
        },
        hints: {
            one_language: "Al menos un idioma",
            title: "Solo títulos oficiales o conocidos; no lo traduzcas tú.",
            sinopsi: "Descripción neutra de la obra; tu opinión va en el post.",
        },
        
    },
    en: {
        head: "Create Work",
        labels: {
            title: "Title",
            sinopsi: "Synopsis",
        },
        hints: {
            one_language: "At least one language",
            title: "Only official or well-known titles; don't translate it yourself.",
            sinopsi: "Neutral description of the work; your opinion goes in the post.",
        },
    },
}

export type WORK_CREATE_TYPE = typeof WORK_CREATE.en
