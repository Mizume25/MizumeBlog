import { Pencil, Trash2 } from 'lucide-react';
import BookCard from '@/core/library/Book';
import { type Book, type CommentRecord } from '@/types';
import BlogLayout from '@/layouts/app/blog-layout';
import { Head } from '@inertiajs/react';
import SettingsLayout from '@/layouts/settings/layout';


interface CommentListItemProps {
    comment: CommentRecord;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

function CommentListItem({ comment, onEdit, onDelete }: CommentListItemProps) {
    return (
        <div className="w-full flex items-center gap-4 bg-[#f3e5ab] border border-black/10 rounded-xl shadow-sm p-3 ">
            {/* Comentario a la izquierda */}
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-[#2d1d0d] text-sm">{comment.user.name}</span>
                    <span className="text-black/40 text-xs">{comment.publish_date}</span>
                </div>
                <p className="text-black/70 text-sm leading-relaxed truncate">
                    {comment.description}
                </p>
            </div>

            {/* Botones solo icono, pegados al comentario */}
            <div className="flex items-center gap-1.5 shrink-0 ">
                <button
                    type="button"
                    onClick={() => onEdit(comment.id)}
                    title="Editar"
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-[rgb(118,77,35)] text-white hover:bg-[#624a2e] transition-colors"
                >
                    <Pencil size={14} />
                </button>
                <button
                    type="button"
                    onClick={() => onDelete(comment.id)}
                    title="Eliminar"
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-red-900/70 text-white hover:bg-red-800 transition-colors"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            {/* BookCard pequeño al final */}
            <div className="shrink-0">
                <BookCard
                    title="Kamisama Memochou"
                    author="Hikaru Sugii"
                    image="kamisama-memochou.jpg"
                    color1="#3a1e06"
                    color2="#7a3a10"
                    accent="#c9a87c"
                />
            </div>
        </div>
    );
}

interface CommentListProps {
    comments: CommentRecord[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

function history({ comments, onEdit, onDelete }: CommentListProps) {
    return (
        <BlogLayout>
            <Head title="Perfil" />

            <SettingsLayout>
                <div className="w-full flex flex-col gap-3">
                    {comments.map((c) => (
                        <CommentListItem key={c.id} comment={c} onEdit={onEdit} onDelete={onDelete} />
                    ))}
                    {comments.length === 0 && (
                        <p className="text-black text-sm text-center py-8">Todavía no hay comentarios.</p>
                    )}
                </div>
            </SettingsLayout>
        </BlogLayout>
    );
}

export default history
