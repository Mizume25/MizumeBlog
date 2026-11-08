import MarkdownService from "@/services/MarkdownService"
import { PostBuild } from "@/types/definitions"
import { useMemo, useState } from "react"

/**
 * Lectura por secciones del post (página works/show/post).
 * La página se monta de nuevo con cada post, así que la sección siempre empieza en 0.
 */
export default function usePostSections(build: PostBuild) {

    /** Servicio de markdown: se crea una vez por build */
    const markdown = useMemo(() => new MarkdownService(build.content, build.index), [build])

    /** Sección actual (base 0) */
    const [section, setSection] = useState(0)

    /** Dirección del último cambio: 1 = avanza (entra por la derecha), -1 = vuelve (entra por la izquierda) */
    const [direction, setDirection] = useState<1 | -1>(1)

    /** Cambia de sección guardando hacia dónde se mueve */
    const changeSection = (next: number) => {
        if (next === section) return
        setDirection(next > section ? 1 : -1)
        setSection(next)
    }

    /** Clic en un nodo del índice: salta a la sección ## a la que pertenece */
    const onIndex = (id: string) => changeSection(markdown.sectionOf(id))

    return {
        section,
        setSection: changeSection,
        direction,
        onIndex,
        /** Total de secciones del post */
        totalSections: markdown.total(),
        /** Trozo de markdown a renderizar: la sección actual */
        body: markdown.section(section),
    }
}
