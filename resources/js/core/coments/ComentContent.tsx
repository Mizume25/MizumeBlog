import { CommentRecord , Reply } from '@/types/definitions';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

type OnDelete = (id: number) => Promise<void>
type OnCreate = (body: string, parent_id?: number | null) => Promise<void>
type OnUpdate = (id: number, body: string) => Promise<void>

/** Componentes compartidos  */
import {
    ComentProfile,
    ComentText
} from './index'
import EditComent from './EditComent';


/***
 * REPLAY DISPLAY
 * Contenido de Respuesta deplegado
 */
function ReplyContent({ answer, onDelete: deleteComment, onUpdate }: { answer: Reply, onDelete: OnDelete, onUpdate: OnUpdate }) {

    const { auth } = usePage<SharedData>().props;

    /** Solo el autor puede editar (el backend también lo comprueba) */
    const isOwner = auth.user.id == answer.user.id;

    const [editing, setEditing] = useState(false);

    /** Borrar Respuesta */
    const onDelete = () => {
        deleteComment(answer.id);
    };

    return (
        <div className="ml-10 mt-4 flex gap-3 items-start border-l-2 border-[#5a4234] pl-4" >
            {/* Avatar Emoji */}
            <div className="text-xl pt-1">🐢</div>

            <div className="flex-grow bg-[#2a1d15]/40 p-3 rounded-r-lg" data-id={answer.id} >
                <div className="flex justify-between items-center mb-1">
                    <h5 className="font-bold text-[#d4a373] text-xs">{answer.user.name}</h5>
                    <span className="text-[10px] text-[#8b5e3c]">{answer.publish_date}</span>
                </div>
                {editing ? (
                    <EditComent
                        initial={answer.description}
                        closeEdit={() => setEditing(false)}
                        onSave={(body) => onUpdate(answer.id, body)}
                    />
                ) : (
                    <p className="text-xs leading-relaxed text-[#c8ad7f]">
                        {answer.description}
                    </p>
                )}

                {!editing && (
                <div className="flex justify-start gap-3 mt-1">
                    {isOwner && (
                        <button
                            onClick={() => setEditing(true)}
                            className="text-[12px] font-medium text-[#d4a373] hover:text-[#f3e5ab] transition-colors duration-200 cursor-pointer uppercase tracking-tighter"
                        >
                            Editar
                        </button>
                    )}
                    <button
                        onClick={onDelete}
                        className="text-[12px] font-medium text-red-900 hover:text-red-600 transition-colors duration-200 cursor-pointer uppercase tracking-tighter"
                    >
                        Eliminar
                    </button>
                </div>
                )}
            </div>
        </div>
    )
}



/**
 * Funcion para iterar y mapear todos los comentarios y respuestas
 * @param coments Comment
 * @returns 
 */
const content = (coments: CommentRecord[], onDelete: OnDelete, onCreate: OnCreate, onUpdate: OnUpdate) => {
        return (
            <>
                {coments.map((comment) => {

                    return (
                        <div key={comment.id} className="space-y-2">
                            <div className="flex gap-4 p-4 rounded-md bg-[#3d2b1f] hover:bg-[#4a3728] transition-colors duration-300 border border-[#4a3728]/50">


                                <ComentProfile avatar={comment.user.avatar} />
                                
                                 {/*** Comentario de texto */}
                                <ComentText coment={comment} onDelete={onDelete} onCreate={onCreate} onUpdate={onUpdate} />


                            </div>

                            {/* Mapeo de Respuestas (Replies) */}
                            {comment.replies && comment.replies.length > 0 &&

                                (
                                    <div className="ml-12 space-y-2">
                                        {comment.replies.map((reply: Reply) => (
                                            <ReplyContent
                                                key={reply.id}
                                                answer={reply}
                                                onDelete={onDelete}
                                                onUpdate={onUpdate}
                                            />
                                        ))}
                                    </div>
                                )}
                        </div>
                    );
                })}
            </>
        );
    };



function ComentContent({ coments, onDelete, onCreate, onUpdate }: { coments: CommentRecord[], onDelete: OnDelete, onCreate: OnCreate, onUpdate: OnUpdate }) {




    return (
        <div className="space-y-6 mb-10" id='contentForm'>
            {content(coments, onDelete, onCreate, onUpdate)}
        </div>
    );
}

export default ComentContent;