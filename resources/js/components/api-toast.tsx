import { type ToastType } from '@/hooks/use-toast';
import { CircleAlert, CircleCheck, TriangleAlert } from 'lucide-react';
import { useEffect, useState } from 'react';

type Toast = { type: ToastType; message: string };

/** Estilos por tipo: fondo/texto con los tokens del tema + icono */
const VARIANTS: Record<ToastType, { box: string; Icon: typeof CircleCheck }> = {
    success: { box: 'bg-btn-success text-btn-success-foreground', Icon: CircleCheck },
    warning: { box: 'bg-btn-warning text-btn-warning-foreground', Icon: TriangleAlert },
    error: { box: 'bg-btn-danger text-btn-danger-foreground', Icon: CircleAlert },
};

/**
 * Funcion para notificar acciones api json
 * Se queda montado con el último toast para poder animar también la salida
 */
export default function ApiToast({ toast }: { toast: Toast | null }) {
    /** Último toast mostrado: se conserva cuando `toast` pasa a null para animar la salida */
    const [last, setLast] = useState<Toast | null>(toast);

    useEffect(() => {
        if (toast) setLast(toast);
    }, [toast]);

    const current = toast ?? last;
    if (!current) return null;

    const visible = toast !== null;
    const { box, Icon } = VARIANTS[current.type] ?? VARIANTS.error;

    return (
        <div className="pointer-events-none fixed top-5 right-5 left-5 z-[100] flex justify-end sm:left-auto">
            <div
                // key: cada toast nuevo vuelve a lanzar la animación de entrada
                key={visible ? `${current.type}-${current.message}` : 'closing'}
                role={current.type === 'error' ? 'alert' : 'status'}
                aria-live={current.type === 'error' ? 'assertive' : 'polite'}
                className={`flex w-full max-w-sm items-center gap-3 rounded-xl border border-white/20 px-4 py-3 shadow-xl ring-1 shadow-black/20 ring-black/5 backdrop-blur-sm ${box} ${
                    visible
                        ? 'pointer-events-auto animate-in duration-300 ease-out fade-in slide-in-from-right-8 zoom-in-95'
                        : 'animate-out duration-300 ease-in fill-mode-forwards fade-out slide-out-to-right-8 zoom-out-95'
                } motion-reduce:animate-none`}
            >
                <Icon className="size-5 shrink-0 opacity-90" aria-hidden="true" />
                <p className="text-sm leading-snug font-medium">{current.message}</p>
            </div>
        </div>
    );
}
