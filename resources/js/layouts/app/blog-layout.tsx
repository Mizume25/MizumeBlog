import FlashHandler from './FlashHandler';
import { Toaster } from '@/components/ui/sonner';
import { ReactNode, useCallback, useState } from 'react';
import {
    BlogSidebar
} from '@/layouts/app'
import { Route } from '@/types';
import { CookieBanner } from '@whotechs/react-gdpr-cookie-banner';
import { useLangStore } from '@/store/lang-store';

/**
 * Textos del banner de cookies (la librería solo permite traducir título y descripción)
 */
const COOKIE_TEXTS = {
    es: {
        title: 'Preferencias de privacidad',
        description: 'Usamos cookies para mejorar tu experiencia en el blog. Puedes aceptarlas todas, elegir cuáles permitir o rechazarlas.',
    },
    en: {
        title: 'Privacy preferences',
        description: 'We use cookies to improve your experience on the blog. You can accept them all, choose which ones to allow or decline them.',
    },
};



/**
 * Props de Layout
 */
export interface LayoutProps {
    children?: ReactNode,
    routes: Route[],
}



function BlogLayout({ children , routes }: LayoutProps) {
    const lang = useLangStore((l) => l.lang)
    const cookieTexts = COOKIE_TEXTS[lang] ?? COOKIE_TEXTS.es

    return (
        <>
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
            <FlashHandler />
            <CookieBanner
                className="mizume-cookie-banner"
                gtmContainerId={import.meta.env.VITE_GTM_ID || ''}
                backgroundColor="var(--mizume-primary)"
                textColor="var(--mizume-primary-foreground)"
                primaryColor="var(--mizume-secondary)"
                titleText={cookieTexts.title}
                descriptionText={cookieTexts.description}
                showDelay={1500}
            />
            <BlogSidebar routes={routes}>
                {children}
            </ BlogSidebar>
        </>
    );
}

export default BlogLayout;
