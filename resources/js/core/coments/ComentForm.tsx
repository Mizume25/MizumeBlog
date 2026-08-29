import { SharedData } from '@/types';
import { handleRequest } from '@/types/request';
import { router, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import ComentProfile from './ComentProfile';

function ComentForm({ post_id }: { post_id: number }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        body: '',
        post_id: post_id,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('comments.store'), {
            preserveScroll: true,
            onSuccess: () => reset('body'),
        });
    };

    return (
        <>
            {auth?.user ? (
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div className="flex items-start gap-4">
                        <ComentProfile avatar={auth.user.avatar} />
                        <div className="flex-grow space-y-3">
                            <textarea
                                value={data.body} // Vinculamos el valor
                                onChange={(e) => setData('body', e.target.value)} // Actualizamos el estado
                                placeholder={`${auth.user?.name ?? 'Oye'}, puedes escribir tu comentario aquí`}
                                className="min-h-[100px] w-full resize-y rounded-md border border-[#4a3728] bg-[#1e140f] p-3 text-[#f3e5ab] placeholder-[#5a4234] focus:ring-2 focus:ring-[#8b5e3c] focus:outline-none"
                            ></textarea>

                            {/* Mostrar errores de validación de Laravel si existen */}
                            {errors.body && <div className="text-sm text-red-500">{errors.body}</div>}

                            <div className="flex justify-end">
                                <button
                                    disabled={processing}
                                    type="submit"
                                    className="cursor-pointer rounded-md bg-[#8b5e3c] px-6 py-2 font-bold text-[#1e140f] shadow-lg transition-all duration-200 hover:bg-[#a67c52] active:scale-95 disabled:opacity-50"
                                >
                                    {processing ? 'Publicando...' : 'Publicar comentario'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="flex items-start gap-4 opacity-80">
                    <div className="flex-grow rounded-md border border-dashed border-[#4a3728] bg-[#1e140f]/50 p-6 text-center">
                        <button
                            onClick={() => router.get(route('register'))}
                            className="cursor-pointer rounded-md bg-[#8b5e3c] px-8 py-2 font-bold text-[#1e140f] shadow-lg transition-all hover:bg-[#a67c52]"
                        >
                            Registrarse
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default ComentForm;
