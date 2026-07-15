import { Pencil, Trash2 } from 'lucide-react';
import BookCard from '@/core/library/BookCard';
import { confirmDelete, type CommentRecord, type Config } from '@/types';
import BlogLayout from '@/layouts/app/blog-layout';
import { Head } from '@inertiajs/react';
import SettingsLayout from '@/layouts/settings/layout';
import { router } from '@inertiajs/react';


interface CommentListItemProps {
    comment: CommentRecord;

    onDelete: (id: number) => void;
}

function CommentListItem({ comment, onDelete }: CommentListItemProps) {

    return (
        <div className=" max-w-[280px] flex items-center bg-[#f3e5ab] border border-black/10 rounded-xl shadow-sm p-3  mb-3">

            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-[#2d1d0d] text-sm capitalize">{comment.user.name}</span>
                    <span className="text-black/40 text-xs">{comment.publish_date}</span>
                </div>
                <p className="text-black/70 text-sm leading-relaxed truncate">
                    {comment.description}
                </p>

                {comment.replies.length > 0 && (
                    <small className='text-[12px] font-bold  '>
                        {`Tiene ${comment.replies.length} respuestas`}
                    </small>
                )}

            </div>

            {/* Botones solo icono, pegados al comentario */}
            <div className="flex items-center gap-1.5 shrink-0 ">
                <a
                    type="button"
                    href={route('post.show', comment.post_id)}
                    title="Editar"
                    className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-full bg-[rgb(118,77,35)] text-white hover:bg-[#624a2e] transition-colors"
                >
                    <Pencil size={14} />
                </a>
                <button
                    type="button"
                    onClick={() => onDelete(comment.id)}
                    title="Eliminar"
                    className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-full bg-red-900/70 text-white hover:bg-red-800 transition-colors"
                >
                    <Trash2 size={14} />
                </button>
            </div>


        </div>
    );
}


type CommentsHistoryResponse = Record<string, CommentRecord[]>;
interface CommentListProps {
    comments: CommentsHistoryResponse;
}

function history({ comments }: CommentListProps) {



    const onDelete = (id: number) => {
        confirmDelete(
            '¿Quieres Eliminar este comentario?',
            `Esta acción borrará permanentemente.`,
            () => router.delete(route('comments.destroy', id), {
                  preserveScroll: true
            })
        );
        
    }

    const onDeletePost = (post_id:string) => {
        confirmDelete(
            '¿Quieres eliminar todos los comentarios de este post?',
            `Esta accion borrara permanetemente tus comentarios`,
             () => router.delete(route('comments.destroyByPost', post_id), {
                preserveScroll: true
             })
        )
    }


    return (
        <BlogLayout>
            <Head title="Perfil" />

            <SettingsLayout>
                <div className="w-full flex flex-col gap-3 ">
                    {Object.entries(comments).map(([post_id, records]) => {

                        const post = records[0]?.post;


                        return (
                            <div key={post_id} className="mb-8">
                                <h2 className="capitalize font-bold text-lg mb-2">{post?.title}</h2>
                                <div className="flex gap-3">
                                    <div className="shrink-0">
                                        {post ? (
                                            <>
                                                <BookCard title={post.title} author={post.author} cover_card={post.cover_card} config={post.config} />
                                         
                                                <button
                                                    type="button"
                                                    onClick={() => onDeletePost(post_id)}
                                                    title="Eliminar Comnetarios Post"
                                                    className="text-sm mt-2 cursor-pointer flex items-center justify-center w-full h-8 rounded-full bg-red-400  text-white hover:bg-red-400 transitation-transform duration-150 hover:scale-105 ease-in-out"
                                                >
                                                    <Trash2 size={14} /> Borrar Todos
                                                </button>
                                            </>

                                        ) : (
                                            <BookCard title="title" author="unknow" cover_card="Icono.jpg" config={{} as Config} />
                                        )}
                                    </div>
                                    <div className="flex-1 grid grid-cols-3 ">
                                        {records.map(record => (
                                            <CommentListItem key={record.id} comment={record} onDelete={onDelete} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    )}
                </div>
            </SettingsLayout>
        </BlogLayout>
    );
}

export default history
