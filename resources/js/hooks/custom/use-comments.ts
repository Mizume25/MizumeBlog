import { apiComments } from "@/types/api"
import { CommentRecord } from "@/types/definitions"
import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Estado de comentarios de un post, separado del build (contenido maquetado).
 * Tras crear o borrar se vuelve a pedir solo la lista de comentarios,
 * sin tocar el markdown, la sección actual ni la animación del post.
 */
export default function useComments(postId: number | null) {

    const [comments, setComments] = useState<CommentRecord[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const [error, setError] = useState<string | null>(null);

    /** Evita aplicar respuestas de un post anterior si se cambia rápido de post */
    const currentPost = useRef<number | null>(postId);

    const refresh = useCallback(async () => {
        if (postId === null) return

        setLoading(true)
        try {
            const data = await apiComments.list(postId)
            if (currentPost.current === postId) {
                setComments(data)
                setError(null)
            }
        } catch (err) {
            if (currentPost.current === postId) setError((err as Error).message)
        } finally {
            if (currentPost.current === postId) setLoading(false)
        }
    }, [postId])

    useEffect(() => {
        currentPost.current = postId
        setComments([])
        setError(null)
        refresh()
    }, [postId, refresh])

    /** Crea un comentario (o respuesta si se pasa parent_id) y refresca la lista. Lanza el error para que el formulario lo muestre */
    const create = useCallback(async (body: string, parent_id: number | null = null) => {
        if (postId === null) return
        await apiComments.store(postId, body, parent_id)
        await refresh()
    }, [postId, refresh])

    /** Edita el texto de un comentario o respuesta y refresca la lista. Lanza el error para que el formulario lo muestre */
    const update = useCallback(async (id: number, body: string) => {
        await apiComments.update(id, body)
        await refresh()
    }, [refresh])

    /** Borra un comentario o respuesta y refresca la lista */
    const remove = useCallback(async (id: number) => {
        try {
            await apiComments.destroy(id)
            await refresh()
        } catch (err) {
            setError((err as Error).message)
        }
    }, [refresh])

    return {
        comments,
        loading,
        error,
        refresh,
        create,
        update,
        remove
    }
}

export type UseComments = ReturnType<typeof useComments>
