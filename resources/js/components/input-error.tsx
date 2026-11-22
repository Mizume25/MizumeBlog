import { cn } from '@/lib/utils';
import { translateMessage } from '@/lib/schema-messages';
import { useLangStore } from '@/store/lang-store';
import { HTMLAttributes } from 'react';

/**
 * Error de un campo. Si message es una clave de schema (lib/schema-messages) se traduce
 * al idioma activo; cualquier otro texto (errores del servidor) se muestra tal cual.
 */
export default function InputError({ message, className = '', ...props }: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    const lang = useLangStore((l) => l.lang);

    return message ? (
        <p {...props} className={cn('text-sm text-red-600 dark:text-red-400', className)}>
            {translateMessage(message, lang)}
        </p>
    ) : null;
}
