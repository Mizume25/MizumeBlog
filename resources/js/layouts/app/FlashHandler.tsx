import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { AlertTriangleIcon, CheckCircle2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
type FlashType = 'success' | 'error' | 'warning';

interface FlashState {
    type: FlashType;
    message: string;
}

function FlashHandler() {
    const { flash } = usePage<SharedData>().props;

    const [view, setView] = useState(false);

    const [current, setCurrent] = useState<FlashState | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setCurrent({ type: 'success', message: flash.success });
            setView(true);
            console.log(flash.success);
        } else if (flash?.error) {
            setCurrent({ type: 'error', message: flash.error });
            setView(true);
        } else if (flash?.warning) {
            setCurrent({ type: 'warning', message: flash.warning });
            setView(true);
        } else {
            return;
        }
        const timer = setTimeout(() => setView(false), 3500);
        return () => clearTimeout(timer);
    }, [flash?.success, flash?.error, flash.warning]);

    const isSuccess = current?.type === 'success';
    const isWarning = current?.type === 'warning';
    return (
        <div
            className={`fixed top-5 right-5 z-[100] transition-all duration-300 ${
                view ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
            }`}
        >
            <div
                className={`flex max-w-sm min-w-[260px] items-center gap-3 rounded-lg border px-4 py-3 shadow-lg ${
                    isSuccess
                        ? 'border-[#8c6c44]/40 bg-[#7ad35f] text-white'
                        : isWarning
                          ? 'border-[#a37c1a]/40 bg-[#e0a11a] text-white'
                          : 'border-[#8c4444]/40 bg-[#fc5353] text-white'
                }`}
            >
                {isSuccess ? (
                    <CheckCircle2 size={18} className="shrink-0" color="white" />
                ) : isWarning ? (
                    <AlertTriangleIcon size={18} className="shrink-0" color="white" />
                ) : (
                    <XCircle size={18} className="shrink-0" color="white" />
                )}
                <p className="text-sm font-medium">{current?.message}</p>
            </div>
        </div>
    );
}

export default FlashHandler;
