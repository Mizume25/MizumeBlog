import { Comentario, Respuesta } from '@/types';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react'

function ReplyComent( { closeReply , coment }:{ closeReply:() => void, coment:Comentario}) {


    const handleClose = (e:React.MouseEvent<HTMLButtonElement>) => {
        closeReply()
    }

   

    // Dentro de tu componente:
        const { data, setData, post, processing, errors, reset } = useForm({
            body: '', // El contenido del comentario
            parent_id: coment.id,
            post_id: coment.post_id,
        });


    const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            post(route('comments.store'), {
                preserveScroll: true,
                onSuccess: () => reset('body'),
            });
        };
    
        //Convertismo El comentario en respueta y accedemos a los datos que hereda 

    return (
        <div className="mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <textarea
                value={data.body}
                onChange={e => setData('body', e.target.value)} 
                 placeholder={`Puedes responder a ${coment.user.name} justo aquí...`}
                className="w-full bg-[#2a1d15] border border-[#5a4234] rounded-lg p-3 
                           text-[#f3e5ab] placeholder-[#5a4234]/70 
                           focus:outline-none focus:border-[#d4a373] focus:ring-1 focus:ring-[#d4a373] 
                           transition-all duration-200 ease-in-out 
                           resize-none min-h-[80px] shadow-inner"
            ></textarea>
            
            <div className="flex justify-end gap-3 mt-2">
                {/* Botón Cancelar - Sutil */}
                <button 
                    onClick={handleClose}
                    className="px-3 py-1 text-xs font-semibold text-[#8b5e3c] hover:text-[#d4a373] transition-colors cursor-pointer"
                >
                    Cancelar
                </button>

                {/* Botón Publicar - Estilo principal */}
                <button 
                    onClick={handleSubmit}
                    className="px-4 py-1.5 bg-[#d4a373] hover:bg-[#b88b5d] text-[#1e140f] 
                               text-xs font-bold rounded-md shadow-sm 
                               transition-all active:scale-95 cursor-pointer"
                >
                    Publicar respuesta
                </button>
            </div>
        </div>
        
    )
}

export default ReplyComent