import React, { useState } from 'react'

interface ReplyComentProps {
    closeReply: () => void,
    /** Publica la respuesta (el padre ya conoce el parent_id). Debe lanzar si falla */
    onReply: (body: string) => Promise<void>
}

export function ReplyComent({ closeReply, onReply }: ReplyComentProps) {

    const [body, setBody] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        closeReply()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);
        try {
            await onReply(body);
            setBody('');
            closeReply();
        } catch (err) {
            // Mensaje de validación de Laravel (422) u otro error
            setError((err as Error).message);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <textarea
                autoFocus
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Escribe tu respuesta"
                className="w-full bg-[#2a1d15] border border-[#5a4234] rounded-lg p-3
                           text-[#f3e5ab] placeholder-[#5a4234]/70
                           focus:outline-none focus:border-[#d4a373] focus:ring-1 focus:ring-[#d4a373]
                           transition-all duration-200 ease-in-out
                           resize-none min-h-[80px] shadow-inner"
            ></textarea>

            {error && <div className="text-xs text-red-500 mt-1">{error}</div>}

            <div className="flex justify-end gap-3 mt-2">
                {/* Botón Cancelar - Sutil */}
                <button
                    type="button"
                    onClick={handleClose}
                    className="px-3 py-1 text-xs font-semibold text-[#8b5e3c] hover:text-[#d4a373] transition-colors cursor-pointer"
                >
                    Cancelar
                </button>

                {/* Botón Publicar - Estilo principal */}
                <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-1.5 bg-[#d4a373] hover:bg-[#b88b5d] text-[#1e140f]
                               text-xs font-bold rounded-md shadow-sm
                               transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                    {processing ? 'Publicando...' : 'Publicar respuesta'}
                </button>
            </div>
        </form>

    )
}

export default ReplyComent
