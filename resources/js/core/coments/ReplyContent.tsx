import React from 'react'
import { Respuesta } from '@/types'
import { router } from '@inertiajs/react';
function ReplyContent({ answer }: { answer: Respuesta }) {


    const handleDeleteReply = () => {
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
                    <span className="text-[10px] text-[#8b5e3c]">{answer.fecha}</span>
                </div>
                <p className="text-xs leading-relaxed text-[#c8ad7f]">
                    {answer.descripcion}
                </p>

                <div className="flex justify-start mt-1">
                    <button
                        onClick={handleDeleteReply}
                        className="text-[12px] font-medium text-red-900 hover:text-red-600 transition-colors duration-200 cursor-pointer uppercase tracking-tighter"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReplyContent