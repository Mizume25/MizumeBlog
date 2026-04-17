import React from 'react'
import ComentProfile from './ComentProfile'
import ComentText from './ComentText'
import { Comentario } from '@/types'
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

function ComentContent({ coments }:{ coments: Comentario[]}) {
const { auth } = usePage<SharedData>().props;
const ListaComentarios = (coments : Comentario []) => {
  return (
    <>
    
    
    <div className="flex gap-4 p-4 rounded-md bg-[#3d2b1f] hover:bg-[#4a3728] transition-colors duration-300 border border-[#4a3728]/50">
      <ComentProfile />
      {coments.map((comentario) => (
        <ComentText 
          key={comentario.id} // Obligatorio en React para el rendimiento
          name={comentario.name} 
          data={comentario.fecha}
          comentario={comentario.descripcion}
          user_id={comentario.user_id}
        />
      ))}
    </div>
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