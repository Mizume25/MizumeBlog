import { Comentario } from '@/types'
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

function ComentsTitle({ coments }:{ coments: Comentario[]}) {  
 const { auth } = usePage<SharedData>().props;

    return (
        <h3 className="text-2xl font-semibold mb-8 border-b border-[#4a3728] pb-2  text-[#d4a373]">
            Comentarios {auth?.user ? (coments.length) : ("")}
        </h3>
    )
}

export default ComentsTitle