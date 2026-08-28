/**
 * @fileoverview Archivo para centralizar Request de Inertia
 */

// resources/js/lib/inertia-requests.ts
import { router } from '@inertiajs/react';
import type { VisitOptions } from '@inertiajs/core';

type Method = 'store' | 'update' | 'destroy' | 'get';

const methodMap: Record<Method, string | null> = {
    store: null,     
    update: 'put',    
    destroy: 'delete', 
    get: 'get',
};

export const handleRequest = (
    action: Method,
    url: string,
    data: Record<string, any> | FormData = {},
    options?: Partial<VisitOptions>,
) => {
    const spoof = methodMap[action];

    if (data instanceof FormData) {
        if (spoof) data.append('_method', spoof);
        return router.post(url, data, options);
    }

    const payload = spoof ? { ...data, _method: spoof } : data;
    return router.post(url, payload, options);
};

