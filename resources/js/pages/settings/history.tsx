import { BlogLayout } from "@/layouts/app";
import SettingsLayout from "@/layouts/settings/layout"
import { confirmDelete, Route, SharedData } from "@/types"
import { router, usePage } from "@inertiajs/react";
import { CalendarDays, ChevronDown, ChevronFirst, ChevronLast, ChevronUp, MessageSquare, Star, Tag, Trash2 } from "lucide-react";
import { useMemo, useState } from "react"
import { CommentRecord, Post, Reply } from "@/types/definitions";

/**
 * settings/history: historial de comentarios del usuario agrupados por post.
 * `comments` llega resuelto del servidor (ProfileController@history) con su `post` y `replies.user`.
 * Los borrados responden con back() y solo se vuelve a pedir la prop `comments`.
 */

/** Props que se recargan tras borrar */
const RELOAD = ['comments', 'flash']

/** Imagen fija que representa al post */
const TURTLE = '/Icons/turtle/turtle-reader.png'

type PostGroup = {
    post: Post
    comments: CommentRecord[]
}

interface HistoryProps {
    comments: CommentRecord[]
}

interface NavProps {
    goPrev: () => void
    goNext: () => void
    index: number
    total: number
}

/**
 * Borrar un comentario
 * @param id Comentario
 */
const onDelete = (id: number) => {
    confirmDelete(
        '¿Quieres eliminar este comentario?',
        'Esta acción lo borrará permanentemente.',
        () => router.delete(route('comments.destroy', id), {
            only: RELOAD,
            preserveScroll: true,
        })
    );
}

/**
 * Borrar todos los comentarios del usuario en un post
 * @param post_id Post
 */
const onDeletePost = (post_id: number) => {
    confirmDelete(
        '¿Quieres eliminar todos los comentarios de este post?',
        'Esta acción borrará permanentemente tus comentarios.',
        () => router.delete(route('comments.destroyByPost', post_id), {
            only: RELOAD,
            preserveScroll: true,
        })
    )
}

/**
 * Borrar todos los comentarios del usuario
 */
const onDeleteAll = () => {
    confirmDelete(
        '¿Quieres eliminar todos tus comentarios?',
        'Esta acción borrará permanentemente todos tus comentarios en todos los posts.',
        () => router.delete(route('comments.deleteAll'), {
            only: RELOAD,
            preserveScroll: true,
        })
    )
}

/**
 * Agrupa los comentarios por post manteniendo el orden (más recientes primero)
 */
function groupByPost(comments: CommentRecord[]): PostGroup[] {
    const map = new Map<number, PostGroup>()

    for (const comment of comments) {
        if (!comment.post) continue
        if (!map.has(comment.post_id)) map.set(comment.post_id, { post: comment.post, comments: [] })
        map.get(comment.post_id)!.comments.push(comment)
    }

    return [...map.values()]
}

/**
 * Navegación entre posts (móvil): horizontal
 */
function NavMobile({ goPrev, goNext, index, total }: NavProps) {
    return (
        <div className="lg:hidden flex items-center gap-2">
            <button
                onClick={goPrev}
                aria-label="Anterior"
                className="cursor-pointer rounded-full p-1 hover:bg-card-hover hover:text-card-foreground transition-colors"
            >
                <ChevronFirst size={20} />
            </button>
            <span className="text-xs font-medium">{index + 1}/{total}</span>
            <button
                onClick={goNext}
                aria-label="Siguiente"
                className="cursor-pointer rounded-full p-1 hover:bg-card-hover hover:text-card-foreground transition-colors"
            >
                <ChevronLast size={20} />
            </button>
        </div>
    )
}

/**
 * Navegación entre posts (escritorio): vertical
 */
function NavDesktop({ goPrev, goNext, index, total }: NavProps) {
    return (
        <div className="hidden lg:flex w-16 shrink-0 flex-col items-center justify-center gap-4 border-l border-card-border bg-card-muted text-card-muted-foreground">
            <button
                onClick={goPrev}
                aria-label="Anterior"
                className="cursor-pointer rounded-full p-2 hover:bg-card-header transition-colors"
            >
                <ChevronUp size={20} />
            </button>
            <span className="text-xs font-medium">{index + 1}/{total}</span>
            <button
                onClick={goNext}
                aria-label="Siguiente"
                className="cursor-pointer rounded-full p-2 hover:bg-card-header transition-colors"
            >
                <ChevronDown size={20} />
            </button>
        </div>
    )
}

/**
 * Tortuga que representa al post con su título y propiedades
 */
function PostCover({ post, total }: { post: Post, total: number }) {
    return (
        <div className="flex lg:w-60 shrink-0 lg:flex-col items-center gap-3 p-4 bg-card-header text-card-header-foreground">
            <img src={TURTLE} alt="" className="w-16 lg:w-32 h-auto object-contain" />

            <div className="flex min-w-0 flex-col gap-2 lg:items-center">
                <h3 className="capitalize font-bold text-sm lg:text-base lg:text-center break-words">
                    {post.title}
                </h3>

                {/** Propiedades del post */}
                <div className="flex flex-wrap gap-1.5 lg:justify-center text-[11px]">
                    {post.type && (
                        <span className="flex items-center gap-1 rounded-full bg-card-muted px-2 py-0.5 text-card-muted-foreground capitalize">
                            <Tag size={11} /> {post.type}
                        </span>
                    )}
                    {post.featured_at && (
                        <span className="flex items-center gap-1 rounded-full bg-card-muted px-2 py-0.5 text-card-muted-foreground">
                            <Star size={11} /> Destacado
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-1 text-[11px] opacity-80 lg:items-center">
                    {post.publish_date && (
                        <span className="flex items-center gap-1">
                            <CalendarDays size={12} /> {post.publish_date}
                        </span>
                    )}
                    <span className="flex items-center gap-1">
                        <MessageSquare size={12} /> {total} {total === 1 ? 'comentario' : 'comentarios'}
                    </span>
                </div>

                {post.description && (
                    <p className="hidden lg:block line-clamp-4 text-xs text-center opacity-80 break-words">
                        {post.description}
                    </p>
                )}
            </div>
        </div>
    )
}

/**
 * Respuesta de otro usuario a un comentario propio
 */
function ReplyItem({ reply }: { reply: Reply }) {
    return (
        <div className="ml-6 flex flex-col gap-0.5 rounded-lg border-l-2 border-item-border bg-card-muted px-3 py-2 text-card-muted-foreground">
            <div className="flex justify-between gap-2 text-[11px]">
                <span className="font-bold">{reply.user?.name ?? 'Usuario'}</span>
                <span className="opacity-70">{reply.publish_date}</span>
            </div>
            <p className="text-xs break-words">{reply.description}</p>
        </div>
    )
}

/**
 * Comentario propio con sus respuestas
 */
function CommentItem({ comment }: { comment: CommentRecord }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-3 rounded-2xl border border-card-border bg-item px-4 py-2 text-card-foreground hover:bg-item-hover transition-colors">
                <div className="min-w-0 flex-1">
                    <span className="text-[11px] text-item-foreground">{comment.publish_date}</span>
                    <p className="break-words">🐢 {comment.description}</p>
                </div>
                <button
                    type="button"
                    title="Eliminar"
                    onClick={() => onDelete(comment.id)}
                    className="cursor-pointer flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-btn-danger text-btn-danger-foreground hover:opacity-90 transition-opacity"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            {comment.replies?.map((reply) => <ReplyItem key={reply.id} reply={reply} />)}
        </div>
    )
}

function History({ comments }: HistoryProps) {

    const { auth } = usePage<SharedData>().props;

    const groups = useMemo(() => groupByPost(comments), [comments])

    const [index, setIndex] = useState(0);

    /** Si se borra el último grupo visible, se cae al último disponible */
    const current = Math.min(index, Math.max(groups.length - 1, 0))

    const goPrev = () => setIndex(current === 0 ? groups.length - 1 : current - 1)

    const goNext = () => setIndex(current === groups.length - 1 ? 0 : current + 1)

    const routes: Route[] = [
        { label: auth.user.name, url: route("profile.edit") },
    ]

    const group = groups[current]

    return (
        <BlogLayout routes={routes}>
            <SettingsLayout>
                {group ? (
                    <div className="w-full overflow-hidden rounded-xl border border-card-border">

                        {/** Barra de acciones */}
                        <div className="flex items-center justify-between gap-3 p-3 bg-card-header text-card-header-foreground">
                            <NavMobile goPrev={goPrev} goNext={goNext} index={current} total={groups.length} />
                            <div className="ms-auto flex items-center gap-2">
                                <button
                                    onClick={() => onDeletePost(group.post.id)}
                                    className="cursor-pointer rounded-2xl px-3 py-2 text-[12px] border border-btn-danger text-btn-danger-foreground bg-btn-danger/70 transition-transform duration-150 hover:-translate-y-0.5"
                                >
                                    Borrar del post
                                </button>
                                <button
                                    onClick={onDeleteAll}
                                    className="cursor-pointer rounded-2xl px-3 py-2 text-[12px] bg-btn-danger text-btn-danger-foreground transition-transform duration-150 hover:-translate-y-0.5"
                                >
                                    Borrar todos
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row bg-card text-card-foreground lg:h-100">
                            <PostCover post={group.post} total={group.comments.length} />

                            {/** Comentarios del post */}
                            <div className="flex-1 min-w-0 flex flex-col gap-3 p-4 overflow-y-auto max-h-100">
                                {group.comments.map((comment) => (
                                    <CommentItem key={comment.id} comment={comment} />
                                ))}
                            </div>

                            <NavDesktop goPrev={goPrev} goNext={goNext} index={current} total={groups.length} />
                        </div>
                    </div>
                ) : (
                    <h2 className="text-card-foreground text-xl font-bold">No hay comentarios</h2>
                )}
            </SettingsLayout>
        </BlogLayout>
    )
}

export default History
