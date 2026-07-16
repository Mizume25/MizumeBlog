import { type CommentRecord , type Reply } from '@/types'
import { router } from '@inertiajs/react';

/** Componentes compartidos  */
import {    
    ComentProfile,
    ComentText
} from './index'


/*** 
 * REPLAY DISPLAY
 * Contenido de Respuesta deplegado
 */
function ReplyContent({ answer }: { answer: Reply }) {
    
    /** Borrar Respuesta */
    const onDelete = () => {
        router.delete(route('comments.destroy', answer.id), {
                preserveScroll: true
        });
        
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
                <p className="text-xs leading-relaxed text-[#c8ad7f]">
                    {answer.description}
                </p>

                <div className="flex justify-start mt-1">
                    <button
                        onClick={onDelete}
                        className="text-[12px] font-medium text-red-900 hover:text-red-600 transition-colors duration-200 cursor-pointer uppercase tracking-tighter"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    )
}



/**
 * Funcion para iterar y mapear todos los comentarios y respuestas
 * @param coments Comment
 * @returns 
 */
const content = (coments: CommentRecord[]) => {
        return (
            <>
                {coments.map((comment) => {

                    return (
                        <div key={comment.id} className="space-y-2">
                            <div className="flex gap-4 p-4 rounded-md bg-[#3d2b1f] hover:bg-[#4a3728] transition-colors duration-300 border border-[#4a3728]/50">


                                <ComentProfile avatar={comment.user.avatar} />
                                
                                 {/*** Comentario de texto */}
                                <ComentText coment={comment} />


                            </div>

                            {/* Mapeo de Respuestas (Replies) */}
                            {comment.replies && comment.replies.length > 0 &&

                                (
                                    <div className="ml-12 space-y-2">
                                        {comment.replies.map((reply: Reply) => (
                                            <ReplyContent
                                                key={reply.id}
                                                answer={reply}
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



function ComentContent({ coments }: { coments: CommentRecord[] }) {


    

    return (
        <div className="space-y-6 mb-10" id='contentForm'>
            {content(coments)}
        </div>
    );
}

export default ComentContent;