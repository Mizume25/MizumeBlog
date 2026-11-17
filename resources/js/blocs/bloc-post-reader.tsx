/**
 * @fileoverview Lector de post reutilizable (sin pestañas ni contexto de works/show).
 *
 * Cabecera (title · publish_date · user.name · selector de secciones), contenido
 * iterable por secciones con transición lateral, índice en el aside que salta a la
 * sección y barra de progreso.
 *
 * - `usePostReader`: devuelve las piezas ya conectadas, para layouts con slots propios.
 * - `BlocPostReader`: todo montado sobre BlogShow (debe ir DENTRO de BlogLayout).
 */

import { BlocSectionPage } from "@/blocs/bloc-manage-info"
import { DATA_WORK_SHOW } from "@/constants/work-show-constants"
import { PageProgress, PostHeader, PostSections, PostSidebar } from "@/core/desktop/work-show-components"
import usePostSections from "@/hooks/custom/use-post-sections"
import { BlogShow } from "@/layouts/app/blog-show"
import { cn } from "@/lib/utils"
import { useLangStore } from "@/store/lang-store"
import { PostBuild, PostRecord } from "@/types/definitions"

/**
 * Estado de lectura + piezas listas para colocar donde se quiera.
 * `headerExtra` se añade al final de la cabecera, tras el selector de secciones.
 */
export function usePostReader(post: PostRecord, build: PostBuild, headerExtra?: React.ReactNode) {

    const lang = useLangStore((l) => l.lang)

    const DATA = DATA_WORK_SHOW[lang]

    const { section, setSection, direction, onIndex, totalSections, body } = usePostSections(build)
    const edit = false
    return {
        section,
        setSection,
        totalSections,

        /** Índice del post (clic = saltar a su sección) */
        aside: <PostSidebar DATA={DATA} index={build.index} onIndex={onIndex} />,

        /** Barra de progreso sticky */
        progress: totalSections > 0 && <PageProgress section={section} total={totalSections} />,

        /** title · publish_date · user.name · selector de secciones */
        header: (
            <PostHeader post={post}>
                <BlocSectionPage
                    variant='numbers'
                    className="flex h-20 items-center justify-center rounded-2xl bg-mizume-fourthary py-2 px-4 min-w-90"
                    lang={lang}
                    key={post.id}
                    sections={{ min: 1, max: totalSections }}
                    value={section + 1}
                    onChange={(n) => setSection(n - 1)}
                    edit={edit}
                />
                {headerExtra}
            </PostHeader>
        ),

        /** Sección actual del markdown con transición */
        content: <PostSections postId={post.id} body={body} section={section} direction={direction} />,
    }
}

interface BlocPostReaderProps {
    post: PostRecord,
    build: PostBuild,
    /** Cabecera a ancho completo encima del lector (opcional) */
    header?: React.ReactNode,
    /** Fila alineada sobre el aside (opcional) */
    asideHeader?: React.ReactNode,
    /** Título del aside (por defecto el título del post) */
    asideTitle?: string,
    /** Extra al final de la cabecera del post */
    headerExtra?: React.ReactNode,
    /** Clases del contenedor principal */
    className?: string,
}

/** Lector de post completo: aside con índice + progreso + cabecera + secciones */
export const BlocPostReader = ({ post, build, header, asideHeader, asideTitle, headerExtra, className }: BlocPostReaderProps) => {

    const reader = usePostReader(post, build, headerExtra)

    return (
        <BlogShow
            header={header}
            asideHeader={asideHeader}
            asideTitle={asideTitle ?? post.title}
            aside={reader.aside}
        >
            {reader.progress}

            <div className={cn("bg-mizume-secondary relative min-h-screen w-full rounded-xl p-6", className)}>
                {reader.header}
                {reader.content}
            </div>
        </BlogShow>
    )
}
