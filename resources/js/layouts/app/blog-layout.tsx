import FlashHandler from './FlashHandler';
import { Toaster } from '@/components/ui/sonner';
import { ReactNode, useCallback, useState } from 'react';
import {
    BlogSidebar
} from '@/layouts/app'
import { Route } from '@/types';



/**
 * Props de Layout
 */
export interface LayoutProps {
    children?: ReactNode,
    routes: Route[],
}



function BlogLayout({ children , routes }: LayoutProps) {
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
            <BlogSidebar routes={routes}>
                {children}
            </ BlogSidebar>
        </>
    );
}

export default BlogLayout;
