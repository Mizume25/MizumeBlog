import { SharedData, FlashMessage } from '@/types';
import { CheckCircle2, XCircle } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { ReactNode, useCallback, useEffect, useState } from 'react';
type FlashType = 'success' | 'error';

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
        setCurrent({ type: 'success', message: flash.success })
        setView(true)
        console.log(flash.success)
    } else if (flash?.error) {
        setCurrent({ type: 'error', message: flash.error })
        setView(true)
    } else {
        return;
    }
    const timer = setTimeout(() => setView(false), 3500);
    return () => clearTimeout(timer);
}, [flash?.success, flash?.error])


    const isSuccess = current?.type === 'success';
    return (
        <div
            className={`fixed top-5 right-5 z-[100] transition-all duration-300 ${view ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
        >
            <div
                className={` capitalize flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border min-w-[260px] max-w-sm ${isSuccess
                        ? 'bg-[#7ad35f] text-[#ffffff] border-[#8c6c44]/40'
                        : 'bg-[#fc5353] text-[#ffffff] border-[#8c4444]/40'
                    }`}
            >
                {isSuccess ? (
                    <CheckCircle2 size={18} className="text-[#C8AD7F] shrink-0" color='white' />
                ) : (
                    <XCircle size={18} className="text-[#e88a8a] shrink-0" color='white' />
                )}
                <p className="text-sm font-medium">{current?.message}</p>
            </div>
        </div>
    )
}

export default FlashHandler