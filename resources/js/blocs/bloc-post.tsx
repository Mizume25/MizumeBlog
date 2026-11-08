/**
 * @fileoverview Bloque de contenido de posts Secciones de comentarios reportes etc
 */

import Coments from "@/core/coments/Coments"
import useComments from "@/hooks/custom/use-comments"
import { CommentRecord } from "@/types/definitions"

interface BlocComentsProps {
    post_id: number,
    /** Prop `comments` de la página works/show/comments: ya llega resuelta del servidor */
    comments: CommentRecord[]
}

/**
 * Los datos vienen de Inertia (props de la página); useComments solo aporta las acciones
 * (crear / editar / borrar / refrescar), que recargan únicamente la prop `comments`.
 */
export const BlocComents = ({ post_id, comments }: BlocComentsProps) => {

    const { refreshing, error, create, update, remove, refresh } = useComments(post_id)

    return (
        <Coments
            coments={comments}
            loading={refreshing}
            error={error}
            onCreate={create}
            onDelete={remove}
            onUpdate={update}
            onRefresh={refresh}
        />
    )

}
