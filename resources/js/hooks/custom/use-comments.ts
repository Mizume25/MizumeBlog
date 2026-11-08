import { SharedData } from "@/types"
import type { RequestPayload } from "@inertiajs/core"
import { router, usePage, usePoll } from "@inertiajs/react"
import { useCallback, useState } from "react"

/** Props que se piden al servidor tras cualquier acción: solo la entidad comentarios (+ el flash del toast) */
const RELOAD = ['comments', 'flash']

/** Intervalo del refresco automático (ms) */
const POLL_INTERVAL = 30_000

/** Etiqueta de caché del prefetch de la pestaña comentarios (ver WorkShowLayout) */
export const COMMENTS_CACHE_TAG = 'comments'

type Method = 'post' | 'put' | 'delete'

/**
 * Acciones sobre los comentarios de la página works/show/comments.
 *
 * Los comentarios NO viven en este hook: son la prop `comments` de la página (Inertia).
 * Cada escritura responde con back() y, gracias a `only`, Inertia solo vuelve a pedir
 * `comments`: no se recalcula el work, el post ni el layout.
 *
 * - refresh(): recarga manual
 * - polling cada 30 s mientras la página esté montada (solo usuarios con sesión);
 *   usePoll se para solo al salir de la pestaña porque la página se desmonta.
 */
export default function useComments(postId: number) {

    const { auth } = usePage<SharedData>().props

    const [refreshing, setRefreshing] = useState(false)

    const [error, setError] = useState<string | null>(null)

    usePoll(POLL_INTERVAL, { only: ['comments'] }, { autoStart: !!auth?.user })

    /**
     * Envuelve una visita de Inertia en una promesa: el formulario (ComentForm/EditComent)
     * espera que la acción lance si falla para mostrar el error.
     */
    const send = useCallback((method: Method, url: string, data?: RequestPayload) =>
        new Promise<void>((resolve, reject) => {
            let settled = false
            const fail = (message: string) => { settled = true; reject(new Error(message)) }

            const options = {
                only: RELOAD,
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    settled = true
                    setError(null)
                    // La copia prefetcheada de esta página ya no es válida
                    router.flushByCacheTags(COMMENTS_CACHE_TAG)
                    resolve()
                },
                /** Errores de validación (422) */
                onError: (errors: Record<string, string>) => fail(Object.values(errors)[0] ?? 'Error en la petición'),
                /** 429 (throttle:comments), 403, 500...: sin el modal por defecto de Inertia */
                onHttpException: (response: { status: number }) => {
                    fail(response.status === 429 ? 'Demasiadas peticiones, espera un momento' : `Error ${response.status}`)
                    return false
                },
                onNetworkError: () => { fail('Error de red'); return false },
                onFinish: () => { if (!settled) fail('La acción no se completó') },
            }

            if (method === 'delete') router.delete(url, options)
            else router[method](url, data ?? {}, options)
        }), [])

    /** Crea un comentario (o respuesta si se pasa parent_id) */
    const create = useCallback((body: string, parent_id: number | null = null) =>
        send('post', route('comments.store'), { post_id: postId, body, parent_id }), [send, postId])

    /** Edita el texto de un comentario o respuesta */
    const update = useCallback((id: number, body: string) =>
        send('put', route('comments.update', id), { body }), [send])

    /** Borra un comentario o respuesta: el error se muestra en la cabecera de la sección */
    const remove = useCallback(async (id: number) => {
        try {
            await send('delete', route('comments.destroy', id))
        } catch (err) {
            setError((err as Error).message)
        }
    }, [send])

    /** Recarga manual de la lista */
    const refresh = useCallback(() => {
        router.reload({
            only: ['comments'],
            onStart: () => setRefreshing(true),
            onFinish: () => setRefreshing(false),
        })
    }, [])

    return {
        refreshing,
        error,
        refresh,
        create,
        update,
        remove
    }
}

export type UseComments = ReturnType<typeof useComments>
