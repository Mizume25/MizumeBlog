/**
 * @fileoverview Bloque de contenido de posts Secciones de comentarios reportes etc
 */

import Coments from "@/core/coments/Coments"
import useComments from "@/hooks/custom/use-comments"

interface BlocComentsProps {
    post_id: number
}

/** Los comentarios viven en su propio estado (useComments), separado del build del post */
export const BlocComents = ({ post_id }: BlocComentsProps) => {

    const { comments, loading, error, create, update, remove } = useComments(post_id)

    return (
        <Coments
            coments={comments}
            loading={loading}
            error={error}
            onCreate={create}
            onDelete={remove}
            onUpdate={update}
        />
    )

}
