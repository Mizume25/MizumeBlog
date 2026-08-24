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
    post_id?: number;
    edit?: boolean;
    onEdit?: () => void;
}

type FlashType = 'success' | 'error';

interface FlashState {
    type: FlashType;
    message: string;
}

function BlogLayout({ children, post_id, edit, onEdit }: LayoutProps) {
    /** Estado del sdiebar responsive */
    const [sidebar, setSideBar] = useState(false);

    /** FUncion de cerrado */
    const handleClose = useCallback(() => setSideBar(false), []);

    /** Cerrado dinamico */
    const onToogle = () => setSideBar((prev) => !prev);



    return (
        <>
            <FlashHandler /> {/*** Mensaje de existo en acciones */}
            <TopAuthBar post_id={post_id} onToggle={onToogle} edit={edit} onEdit={onEdit} /> {/*** Menu de Navegación */}
            <main>
              
                <SideBarLeft isOpen={sidebar} onClose={handleClose} id={post_id} /> {/*** Sidebar Responsive */}
                {children} {/*** Contenido */}
            </main>
            <HomeFooter />
        </>
    );
}

export default BlogLayout;
