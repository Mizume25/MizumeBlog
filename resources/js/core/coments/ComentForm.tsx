import { SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import ComentProfile from './ComentProfile';

interface ComentFormProps {
    onCreate: (body: string, parent_id?: number | null) => Promise<void>
}

function ComentForm({ onCreate }: ComentFormProps) {
    const { auth } = usePage<SharedData>().props;

    const [body, setBody] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);
        try {
            await onCreate(body);
            setBody('');
        } catch (err) {
            // Mensaje de validación de Laravel (422) u otro error
            setError((err as Error).message);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            {auth?.user ? (
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div className="flex items-start gap-4">
                        <ComentProfile avatar={auth.user.avatar} />
                        <div className="flex-grow space-y-3">
                            <textarea
                                value={body} // Vinculamos el valor
                                onChange={(e) => setBody(e.target.value)} // Actualizamos el estado
                                placeholder={`${auth.user?.name ?? 'Oye'}, puedes escribir tu comentario aquí`}
                                className="min-h-[100px] w-full resize-y rounded-md border border-[#4a3728] bg-[#1e140f] p-3 text-[#f3e5ab] placeholder-[#5a4234] focus:ring-2 focus:ring-[#8b5e3c] focus:outline-none"
                            ></textarea>

                            {/* Mostrar errores de validación de Laravel si existen */}
                            {error && <div className="text-sm text-red-500">{error}</div>}

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
