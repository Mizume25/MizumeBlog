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
