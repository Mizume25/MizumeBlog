import React, { useEffect } from 'react'
import ComentProfile from './ComentProfile'
import ComentText from './ComentText'
import ReplyContent from './ReplyContent';
import { Comentario, Respuesta, User } from '@/types'

function ComentContent({ coments, users }: { coments: Comentario[], users: User[] }) {

    // Función de búsqueda para encontrar los datos del usuario en el array global
    const handlerUser = (userId: number) => {
        return users.find(u => u.id === userId);
    };


    const ListaComentarios = (coments: Comentario[]) => {
        return (
            <>
                {coments
                    .filter((comentario) => !(comentario as any).parent_id)
                    .map((comentario) => {
                        
                        // 1. Buscamos el usuario específico dentro del ciclo map
                        const u = handlerUser(comentario.user.id);

                        return (
                            <div key={comentario.id} className="space-y-2">
                                <div className="flex gap-4 p-4 rounded-md bg-[#3d2b1f] hover:bg-[#4a3728] transition-colors duration-300 border border-[#4a3728]/50">
                                    
                                    
                                    <ComentProfile user={u || comentario.user} />

                                    <ComentText coment={comentario} />
                                </div>

                                {/* Mapeo de Respuestas (Replies) */}
                                {comentario.replies && comentario.replies.length > 0 && (
                                    <div className="ml-12 space-y-2">
                                        {comentario.replies.map((respuesta: Respuesta) => (
                                            <ReplyContent 
                                                key={respuesta.id} 
                                                answer={respuesta} 
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

    return (
        <div className="space-y-6 mb-10" id='contentForm'>
            {ListaComentarios(coments)}
        </div>
    );
}

export default ComentContent;