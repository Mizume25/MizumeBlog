import { Comentario } from '@/types'
import React from 'react'

function Reply( { reply } : { reply: Comentario[]}) {

    //Iterar Respuestas
    const renderReplays = () => {
       return reply.map((p, i) => {
       
        <div className="flex gap-2 items-start">
            
            <span className="text-base mt-0.5 select-none">🐢</span>

            <div className="flex-grow">
                <div className="flex justify-between items-center mb-0.5">
                    <h5 className="text-xs font-bold text-[#d4a373]">UsuarioPrueba</h5>
                    <span className="text-[10px] text-[#8b5e3c]">hace 5 min</span>
                </div>
                <p className="text-xs leading-relaxed text-[#c8ad7f]">
                    Esta es una respuesta de prueba al comentario padre. Aquí iría el contenido de la respuesta.
                </p>
            </div>

        </div>
       }) 
    }


  return (
    <div className="mt-3 ml-4 border-l-2 border-[#d4a373]/30 pl-3 flex flex-col gap-3">
        
        

    </div>
  )
}

export default Reply