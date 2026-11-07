import React, { useState } from 'react'

interface EditComentProps {
    /** Texto actual del comentario */
    initial: string,
    closeEdit: () => void,
    /** Guarda el nuevo texto (el padre ya conoce el id). Debe lanzar si falla */
    onSave: (body: string) => Promise<void>
}

/** Formulario en línea para editar un comentario o respuesta */
export function EditComent({ initial, closeEdit, onSave }: EditComentProps) {

    const [body, setBody] = useState(initial);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Sin cambios: solo cerramos
        if (body.trim() === initial.trim()) {
            closeEdit();
            return;
        }

        setProcessing(true);
        setError(null);
        try {
            await onSave(body);
            closeEdit();
        } catch (err) {
            // Mensaje de validación de Laravel (422) u otro error
            setError((err as Error).message);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
            <textarea
                autoFocus
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full bg-[#2a1d15] border border-[#5a4234] rounded-lg p-3
                           text-sm text-[#f3e5ab] placeholder-[#5a4234]/70
                           focus:outline-none focus:border-[#d4a373] focus:ring-1 focus:ring-[#d4a373]
                           transition-all duration-200 ease-in-out
                           resize-none min-h-[80px] shadow-inner"
            ></textarea>

            {error && <div className="text-xs text-red-500 mt-1">{error}</div>}

            <div className="flex justify-end gap-3 mt-2">
                <button
                    type="button"
                    onClick={closeEdit}
                    className="px-3 py-1 text-xs font-semibold text-[#8b5e3c] hover:text-[#d4a373] transition-colors cursor-pointer"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-1.5 bg-[#d4a373] hover:bg-[#b88b5d] text-[#1e140f]
                               text-xs font-bold rounded-md shadow-sm
                               transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                    {processing ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
        </form>
    )
}

export default EditComent
