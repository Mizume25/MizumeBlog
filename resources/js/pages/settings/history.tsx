import BlogLayout from "@/layouts/app/blog-layout"
import SettingsLayout from "@/layouts/settings/layout"
import { CommentRecord, confirmDelete, Post } from "@/types"
import { router } from "@inertiajs/react";
import { ChevronDown, ChevronFirst, ChevronLast, ChevronUp, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react"

/*** Botones de indezar post */
interface ButtonsProps {
    goPrev: () => void
    goNext: () => void
    index: number
    posts: Post[]
}

/**
 * Boorar Comentario
 * @param id Comentario
 */
const onDelete = (id: number) => {
    confirmDelete(
        '¿Quieres Eliminar este comentario?',
        `Esta acción borrará permanentemente.`,
        () => router.delete(route('comments.destroy', id), {
            preserveScroll: true
        })
    );

}

/**
 * Borrar todo slos cmentario de el post
 * @param post_id 
 */
const onDeletePost = (post_id: number) => {
    confirmDelete(
        '¿Quieres eliminar todos los comentarios de este post?',
        `Esta accion borrara permanetemente tus comentarios`,
        () => router.delete(route('comments.destroyByPost', post_id), {
            preserveScroll: true
        })
    )
}


/**
 * Botones Responsivos
 * @param goNext siguiene post
 * @param goPrev previo post
 * @param index indice actual
 * @param posts Post Actuales
 * @returns 
 */
function ButtonsRepo({ goNext, goPrev, posts, index }: ButtonsProps) {
    return (
        <div className="lg:hidden w-35 flex flex-row justify-between items-center">
            <button className="rounded-2xl hover:bg-white/90 hover:text-black p-1 duration-150 ease-in-out transition-transform hover:scale-105" onClick={goPrev}><ChevronFirst size={20} /></button>
            <p className="capitalize">{posts[index].title.length > 10 ? posts[index].web_title ?? `Lectura de ${posts[index].author}` : posts[index].title}</p>
            <button className="rounded-2xl hover:bg-white/90 hover:text-black p-1 duration-150 ease-in-out transition-transform hover:scale-105" onClick={goNext}><ChevronLast size={20} /></button>
        </div>
    )
}


/**
 * Botones Responsivos
 * @param goNext siguiene post
 * @param goPrev previo post
 * @param index indice actual
 * @param posts Post Actuales
 * @returns 
 */
function Buttons({ goNext, goPrev, index, posts }: ButtonsProps) {
    return (
        <>
            <button
                onClick={goPrev}
                className="p-2 rounded-full hover:bg-gray-200 transition"
                aria-label="Anterior"
            >
                <ChevronUp size={20} />
            </button>

            <span className="text-xs font-medium text-gray-500">
                {index + 1}/{posts.length}
            </span>

            <button
                onClick={goNext}
                className="p-2 rounded-full hover:bg-gray-200 transition"
                aria-label="Siguiente"
            >
                <ChevronDown size={20} />
            </button>
        </>
    )
}

/**
 * Sere de comentarios
 * @param comments Array de Comentarios
 * @returns 
 */
function RenderComents({ comments }: { comments: CommentRecord[] }) {
    return (
        <div className="flex flex-col gap-3 p-4">


            {comments.length != 0 ? (comments.map((comment) => (
                <div key={comment.id} className="max-w-full bg-amber-200 flex flex-row justify-between items-start rounded-2xl px-4 py-2 max-h-25 overflow-y-auto">
                    <p className="ms-1 min-w-0 flex-1 break-words break-all">
                        🐢 {comment.description}
                    </p>
                    <div className="flex items-center justify-center gap-1.5 shrink-0">

                        <a type="button"
                            href={route('post.show', comment.post_id)}
                            title="Editar"
                            className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-full bg-[rgb(118,77,35)] text-white hover:bg-[#624a2e] transition-colors"
                        >
                            <Pencil size={14} />
                        </a>
                        <button
                            type="button"
                            title="Eliminar"
                            onClick={() => onDelete(comment.id)}
                            className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-full bg-red-900/70 text-white hover:bg-red-800 transition-colors"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>))

            ) : (
                <>
                    <h2 className="text-white text-xl font-bold">No hay mas comentarios</h2>
                </>
            )}

        </div>
    )
}

interface NavProps {
    loadBack: () => void,
    loadMore: () => void,
    hasMore: boolean,
    page: number,
    onDeletePost: (id: number) => void,
    post_id: number
}

function NavCommand({ loadBack, loadMore, page, hasMore, onDeletePost, post_id }: NavProps) {
    return (
        <>
            <button
                onClick={() => onDeletePost(post_id)}
                className="w-25 h-15 bg-red-500 text-white rounded-2xl p-2 text-[12px] cursor-pointer transition-transform duration-150 hover:-translate-y-1.5">
                Borrar Todos
            </button>

            <button onClick={loadBack} disabled={page === 1} className="flex items-center justify-center w-25 h-15 bg-amber-200 text-white rounded-2xl p-2 text-[12px] cursor-pointer hover:bg-amber-200/90">
                <ChevronFirst className="text-black" />
            </button>

            <button onClick={loadMore} disabled={!hasMore} className="flex items-center justify-center w-25 h-15 bg-amber-200 text-white rounded-2xl p-2 text-[12px] cursor-pointer hover:bg-amber-200/90">
                <ChevronLast className="text-black" />
            </button>
        </>
    )
}



interface historyProps {
    posts: Post[],
}


function history({ posts }: historyProps) {

    const [index, setIndex] = useState(0);

    const [page, setPage] = useState(1);

    const [hasMore, setHasMore] = useState(true);

    const [comments, setComments] = useState<CommentRecord[]>([]);

    const goPrev = () => {
        setIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
        setPage(1);
        setComments([])
    }

    const goNext = () => {
        setIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1))
        setPage(1);
        setComments([])
    };

    const loadMore = () => setPage(prev => prev + 1);

    const loadBack = () => setPage(prev => prev == 1 ? 1 : prev - 1);


    /** Api key commments */
    useEffect(() => {
        if(posts.length === 0) return;
        const controller = new AbortController();
        fetch(`/api/posts/${posts[index].id}/comments?page=${page}`, {
            credentials: 'same-origin',
            headers: { 'Accept': 'application/json' },
            signal: controller.signal
        })
            .then(res => res.json())
            .then(data => {

                setComments(data.data);
                setHasMore(data.next_page_url !== null);

            })
            .catch(err => {
                if (err.name !== 'AbortError') console.log(err)
            });

        return () => controller.abort();
    }, [page, index]);


    return (
        <BlogLayout>
            <SettingsLayout>
                {posts.length != 0 ? (
                    <>

                        <div className="w-full h-15 -mb-1 rounded-t-xl  p-3 bg-gray-600/50 flex flex-start gap-3 overflow-hidden">
                            <ButtonsRepo goNext={goNext} goPrev={goPrev} index={index} posts={posts} />
                            <NavCommand
                                loadBack={loadBack}
                                loadMore={loadMore}
                                page={page}
                                hasMore={hasMore}
                                onDeletePost={onDeletePost}
                                post_id={posts[index].id}
                            />

                        </div>


                        <div className="w-full flex lg:flex-row flex-col h-full overflow-hidden ">



                            <div className="w-full h-100 border-black bg-gray-700 flex items-end justify-between bg-no-repeat bg-cover p-1  ">

                                <div
                                    className="hidden lg:block h-full w-70 bg-gray-100 bg-cover bg-center bg-no-repeat "
                                    style={{
                                        backgroundImage: `url(/IMG/Cards/${posts[index].cover_card})`,
                                        objectPosition: `${posts[index].config?.card_config}`,
                                    }}
                                />


                                <div className="w-full lg:columns-1 gap-1 p-2 auto-rows-min">
                                    <div className="w-full bg-amber-100/10 rounded-2xl">

                                        <RenderComents comments={comments} />

                                    </div>

                                    <div className="w-full bg-amber-100/10 rounded-2xl">


                                    </div>
                                </div>


                                {/** Container de comentarios */}
                                <div className="hidden min-lg:flex w-16 h-full flex-shrink-0 border-l border-gray-200 flex-col items-center justify-center gap-4 bg-gray-50">
                                    <Buttons goPrev={goPrev} goNext={goNext} index={index} posts={posts} />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                    <h2>No hay Comentarios</h2>
                    </>
                )}

            </SettingsLayout>
        </BlogLayout >
    )
}

export default history