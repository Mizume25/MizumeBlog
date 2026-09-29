/** Componentes */
import SideBarLeft from '@/core/auth/SideBarLeft';
import TopAuthBar from '@/core/auth/TopAuthBar';
import HomeFooter from '@/core/home/HomeFooter';

import FlashHandler from './FlashHandler';

/** ESTADOS REACT */

import { ReactNode, useCallback, useState } from 'react';

/**
 * Props de Layout
 */
export interface LayoutProps {
    children?: ReactNode;
    edit?: boolean;
    onEdit?: () => void;
}



function BlogLayout({ children, edit, onEdit }: LayoutProps) {
    /** Estado del sdiebar responsive */
    const [sidebar, setSideBar] = useState(false);

    /** FUncion de cerrado */
    const handleClose = useCallback(() => setSideBar(false), []);

    /** Cerrado dinamico */
    const onToogle = () => setSideBar((prev) => !prev);



    return (
        <>
            <FlashHandler /> {/*** Mensaje de existo en acciones */}

            <TopAuthBar  onToggle={onToogle} edit={edit} onEdit={onEdit} /> {/*** Menu de Navegación */}
            <main>
              
              
                {children} 
            </main>
            <HomeFooter />
        </>
    );
}

export default BlogLayout;
