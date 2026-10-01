/** Componentes */
import SideBarLeft from '@/core/auth/SideBarLeft';
import TopAuthBar from '@/layouts/app/blog-top-bar';
import HomeFooter from '@/core/home/HomeFooter';

import FlashHandler from './FlashHandler';

/** ESTADOS REACT */

import { ReactNode, useCallback, useState } from 'react';



import { SidebarProvider, SidebarTrigger } from "@/components/animate-ui/components/radix/sidebar"
import { AppSidebar } from '@/components/app-sidebar';
import { BlogSidebar } from './blog-sidebar';
/**
 * Props de Layout
 */
export interface LayoutProps {
    children?: ReactNode;
}



function BlogLayout({ children }: LayoutProps) {
    /** Estado del sdiebar responsive */
    const [sidebar, setSideBar] = useState(false);

    /** FUncion de cerrado */
    const handleClose = useCallback(() => setSideBar(false), []);

    /** Cerrado dinamico */
    const onToogle = () => setSideBar((prev) => !prev);



    return (
        <>
            <FlashHandler />

            <BlogSidebar />
        </>
    );
}

export default BlogLayout;
