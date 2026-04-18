import { router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { toast } from 'sonner';
function ComentText({ key, id ,name, data, comentario, user_id }: { key: number, id:number, name: string, data: string, comentario: string, user_id: number }) {
    const { auth } = usePage<SharedData>().props;
    
    const handleDelete = () => {
        router.delete(route('comments.destroy', id),{
        preserveScroll:true
     });
        
    };

    return (
        <div className="flex-grow" key={key}>
            <div className="flex justify-between items-center mb-1">
                <h4 className="font-bold text-[#d4a373]">{name}</h4>
                <span className="text-xs text-[#8b5e3c]">{data}</span>
            </div>
            <p className="text-sm leading-relaxed text-[#c8ad7f]">
                {comentario}
            </p>
            {(auth.user.id == user_id || auth.user.role == 'admin') && (
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