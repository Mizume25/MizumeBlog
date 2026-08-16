// resources/js/hooks/useToast.ts
import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning';

interface ToastState {
    type: ToastType;
    message: string;
}

export function useToast() {
    const [toast, setToast] = useState<ToastState | null>(null);

    const showToast = useCallback((type: ToastType, message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3500);
    }, []);

    return { toast, showToast };
}