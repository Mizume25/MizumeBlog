import React from 'react'
import ComentProfile from './ComentProfile'
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

function ComentForm({ post_id }:{ post_id:number}) {


    const handleRegister = () => {
    // Esto simplemente cambia la URL a la de registro
    router.get(route('register'));
    };

    const { auth } = usePage<SharedData>().props;
    // Dentro de tu componente:
    const { data, setData, post, processing, errors, reset } = useForm({
        body: '', // El contenido del comentario
        post_id: post_id,
    });

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('comments.store'), {
        onSuccess: () => reset('body'), 
    });

    

    
};


    return (
        <form className="mt-8 space-y-4" onSubmit={auth.user ? handleSubmit : handleRegister} >
            <div className="flex gap-4 items-start">
                <ComentProfile />
                <div className="flex-grow space-y-3">
                    <textarea
                        value={data.body} // Vinculamos el valor
                        onChange={e => setData('body', e.target.value)} // Actualizamos el estado
                        placeholder={`${auth.user?.name ?? "Oye"}, puedes escribir tu comentario aquí`}
                        className="w-full bg-[#1e140f] border border-[#4a3728] rounded-md p-3 text-[#f3e5ab] placeholder-[#5a4234] focus:outline-none focus:ring-2 focus:ring-[#8b5e3c] resize-y min-h-[100px]"
                    ></textarea>

                    {/* Mostrar errores de validación de Laravel si existen */}
                    {errors.body && <div className="text-red-500 text-sm">{errors.body}</div>}

                    <div className="flex justify-end">
                        <button
                            disabled={processing} // Evita múltiples clics
                            type="submit"
                            className="cursor-pointer bg-[#8b5e3c] hover:bg-[#a67c52] text-[#1e140f] font-bold py-2 px-6 rounded-md transition-all duration-200 shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            {processing ? 'Publicando...' : 'Publicar comentario'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default ComentForm