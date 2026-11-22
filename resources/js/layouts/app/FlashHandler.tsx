import { Toaster } from '@/components/ui/sonner';
import { FlashMessage } from '@/types';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

type FlashType = 'success' | 'error' | 'warning';

interface FlashState {
    type: FlashType;
    message: string;
}

interface FlashHandlerProps {
    /** Flash de la primera carga (props.initialPage.props.flash) */
    initialFlash?: FlashMessage | null;
}

const TOAST_DURATION = 3500;

/** Elige el mensaje a mostrar según prioridad: success > error > warning */
const resolveFlash = (flash?: FlashMessage | null): FlashState | null => {
    if (flash?.success) return { type: 'success', message: flash.success };
    if (flash?.error) return { type: 'error', message: flash.error };
    if (flash?.warning) return { type: 'warning', message: flash.warning };
    return null;
};

const showFlash = (flash?: FlashMessage | null) => {
    const current = resolveFlash(flash);
    if (!current) return;

    // Un tick de margen para asegurar que el Toaster ya está suscrito
    setTimeout(() => toast[current.type](current.message, { duration: TOAST_DURATION }), 0);
};

/**
 * Toaster global + lector del flash compartido por Inertia.
 *
 * Se monta una única vez en app.tsx (fuera de las páginas), así no se desmonta
 * al cambiar de página y los redirect()->route(...)->with(...) a otra vista se muestran.
 *
 * Usa el evento 'success' del router (solo respuestas del servidor), por lo que
 * navegar con atrás/adelante del historial no repite toasts antiguos.
 */
function FlashHandler({ initialFlash }: FlashHandlerProps) {
    useEffect(() => {
        showFlash(initialFlash);

        return router.on('success', (event) => {
            showFlash(event.detail.page.props.flash as FlashMessage | undefined);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Toaster
            position="top-right"
            toastOptions={{
                classNames: {
                    success: '!border-[#8c6c44]/40 !bg-[#7ad35f] !text-white',
                    warning: '!border-[#a37c1a]/40 !bg-[#e0a11a] !text-white',
                    error: '!border-[#8c4444]/40 !bg-[#fc5353] !text-white',
                },
            }}
        />
    );
}

export default FlashHandler;
