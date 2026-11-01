import { BlogShowContextProps } from '@/types/custom/blog-show-types';
import React from 'react';

export const DESKTOP_QUERY = '(min-width: 1024px)';

export const BlogShowContext = React.createContext<BlogShowContextProps | null>(null);

/**
 * Lee el estado compartido de <BlogShow>.
 * Úsalo en los hijos (ej. BlogShowTrigger), nunca useBlogShow().
 */
export const useBlogShowContext = () => {
    const ctx = React.useContext(BlogShowContext);
    if (!ctx) throw new Error('BlogShowTrigger debe usarse dentro de <BlogShow>.');
    return ctx;
};

/**
 * Crea el estado del layout. Solo debe usarlo <BlogShow>.
 */
export default function useBlogShow(hasAside: boolean) {
    const [openMobile, setOpenMobile] = React.useState(false);
    const [openDesktop, setOpenDesktop] = React.useState(true);
    const toggleDesktop = React.useCallback(() => setOpenDesktop((prev) => !prev), []);

    // Al pasar a escritorio se cierra el Sheet móvil
    React.useEffect(() => {
        const mql = window.matchMedia(DESKTOP_QUERY);
        const onChange = (e: MediaQueryListEvent) => {
            if (e.matches) setOpenMobile(false);
        };
        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
    }, []);

    const contextValue = React.useMemo<BlogShowContextProps>(
        () => ({ hasAside, openMobile, setOpenMobile }),
        [hasAside, openMobile],
    );

    return {
        openMobile,
        setOpenMobile,
        openDesktop,
        toggleDesktop,
        contextValue,
    };
}
