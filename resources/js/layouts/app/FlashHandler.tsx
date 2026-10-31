import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
type FlashType = 'success' | 'error' | 'warning';

interface FlashState {
    type: FlashType;
    message: string;
}

const TOAST_DURATION = 3500;

/**
 * Lee el flash compartido por Inertia y lo muestra con sonner
 */
function FlashHandler() {
    const { flash } = usePage<SharedData>().props;

    useEffect(() => {
        let current: FlashState | null = null;

        if (flash?.success) current = { type: 'success', message: flash.success };
        else if (flash?.error) current = { type: 'error', message: flash.error };
        else if (flash?.warning) current = { type: 'warning', message: flash.warning };

        if (!current) return;

        toast[current.type](current.message, { duration: TOAST_DURATION });
    }, [flash]);

    return null;
}

export default FlashHandler;
