import { router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { SharedData, Comentario } from '@/types';
import { toast } from 'sonner';
function ComentText({ coment }: { coment: Comentario }) {
    const { auth } = usePage<SharedData>().props;

    const handleDelete = () => {
        router.delete(route('comments.destroy', coment.id), {
            preserveScroll: true
        });

    };



    return (
        <div className="flex-grow" key={coment.id}>
            <div className="flex justify-between items-center mb-1">
                <h4 className="font-bold text-[#d4a373]">{coment.name}</h4>
                <span className="text-xs text-[#8b5e3c]">{coment.fecha}</span>
            </div>
            <p className="text-sm leading-relaxed text-[#c8ad7f]">
                {coment.descripcion}
            </p>
           

            {(auth.user.id == coment.user_id || auth.user.role == 'admin') && (
                <div className="flex justify-end mt-2">
                    <button
                        onClick={handleDelete}
                        className="px-4 py-1 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xs font-bold rounded-md transition-colors cursor-pointer"
                    >
                        Eliminar
                    </button>
                </div>
            )}
        </div>
    )
}

export default ComentText