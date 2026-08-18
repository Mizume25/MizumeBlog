import { type ToastType, useToast } from '@/hooks/use-toast';
/**
 * Funcion para notificar acciones api json
 */
export default function ApiToast({ toast }: { toast: { type: ToastType; message: string } | null }) {
    if (!toast) return null;

    return (
        <div
            className={`fixed top-5 right-5 z-[100] transition-all duration-500 ease-out ${
                toast ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-8 opacity-0'
            }`}
        >
            <div
                className={`flex min-w-[260px] items-center gap-3 rounded-lg border px-4 py-3 shadow-lg ${
                    toast?.type === 'success'
                        ? 'bg-[#7ad35f] text-white'
                        : toast?.type === 'warning'
                          ? 'bg-[#e0a11a] text-white'
                          : 'bg-[#fc5353] text-white'
                }`}
            >
                <p className="text-sm font-medium">{toast?.message}</p>
            </div>
        </div>
    );
}