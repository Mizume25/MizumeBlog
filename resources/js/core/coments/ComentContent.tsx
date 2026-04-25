import React from 'react'
import ComentProfile from './ComentProfile'
import ComentText from './ComentText'
import { Comentario } from '@/types'
import { usePage } from '@inertiajs/react';
import { SharedData , Respuesta} from '@/types';
import ReplyContent from './ReplyContent';
function ComentContent({ coments }:{ coments: Comentario[]}) {
const { auth } = usePage<SharedData>().props;


const ListaComentarios = (coments : Comentario []) => {
    return (
      <>
        
        
        {coments
          .filter((comentario) => !(comentario as any).parent_id) 
          .map((comentario) => (
            <div key={comentario.id} className="space-y-2">
              <div className="flex gap-4 p-4 rounded-md bg-[#3d2b1f] hover:bg-[#4a3728] transition-colors duration-300 border border-[#4a3728]/50">
                <ComentProfile />
                <ComentText coment={comentario} />
              </div>

            {/* Mapeo de Respuestas (Replies) */}
            {comentario.replies && comentario.replies.length > 0 && (
              <div className="ml-12 space-y-2"> {/* Margen izquierdo para el hilo */}
                {comentario.replies.map((respuesta: Respuesta) => (
                  <ReplyContent 
                  key={respuesta.id}
                  answer={respuesta} />
                ))}
              </div>
            )}
          </div>
        ))}
      </>
    );
  };

    return (
        <div className="space-y-6 mb-10">
                 
                 
                {ListaComentarios(coments)}
        </div>
    )
}

export default ComentContent