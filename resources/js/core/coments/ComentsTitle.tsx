import { Comment } from '@/types/definitions';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

function ComentsTitle({ coments }:{ coments: Comment[]}) {  
 const { auth } = usePage<SharedData>().props;

    return (
        <h3 className="text-2xl font-semibold mb-8 border-b border-card-border pb-2  text-card-header">
            Comentarios {auth?.user ? (coments.length) : ("")}
        </h3>
    )
}

export default ComentsTitle