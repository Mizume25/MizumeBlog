import FlashHandler from './FlashHandler';
import { ReactNode, useCallback, useState } from 'react';
import {
    BlogSidebar
} from '@/layouts/app'

/**
 * Props de Layout
 */
export interface LayoutProps {
    children?: ReactNode;
}



function BlogLayout({ children }: LayoutProps) {
    return (
        <>
            <FlashHandler />
            <BlogSidebar>
                {children}
            </ BlogSidebar>
        </>
    );
}

export default BlogLayout;
