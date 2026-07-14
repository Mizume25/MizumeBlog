import SideBarLeft from '@/core/auth/SideBarLeft';
import TopAuthBar from '@/core/auth/TopAuthBar'
import HomeFooter from '@/core/home/HomeFooter';
import { usePage } from '@inertiajs/react';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { SharedData, FlashMessage, IndexContent } from '@/types';
import { CheckCircle2, XCircle } from 'lucide-react';
import FlashHandler from './FlashHandler';
/**
 * Props de Layout
 */
export interface LayoutProps {
  children?: ReactNode;
  post_id?: number;
}

type FlashType = 'success' | 'error';

interface FlashState {
  type: FlashType;
  message: string;
}



function BlogLayout({ children, post_id }: LayoutProps) {

  const [sidebar, setSideBar] = useState(false);

  const handleClose = useCallback(() => setSideBar(false), []);

  const onToogle = () => setSideBar(prev => !prev);;




  return (
    <>
      <FlashHandler />
      <TopAuthBar post_id={post_id} onToggle={onToogle} />
      <main>
        <SideBarLeft isOpen={sidebar} onClose={handleClose} id={post_id} />
        {children}

      </main>
      <HomeFooter />
    </>
  )
}

export default BlogLayout