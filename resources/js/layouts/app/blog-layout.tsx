import SideBarLeft from '@/core/auth/SideBarLeft';
import TopAuthBar from '@/core/auth/TopAuthBar'
import { HomeSideBarLeft } from '@/core/home';
import HomeFooter from '@/core/home/HomeFooter';
import { IndexContent } from '@/types';
import { ReactNode, useCallback, useState } from 'react';


export interface LayoutProps {
  children?: ReactNode;
  post_id?: number;
  index?: IndexContent[];
}

function BlogLayout({ children, post_id, index }: LayoutProps) {

  const [sidebar, setSideBar] = useState(false);

  const handleClose = useCallback(() => setSideBar(false), []);

  const onToogle = () => setSideBar(prev => !prev);;


  return (
    <>
      <TopAuthBar post_id={post_id} onToggle={onToogle} />
      <main>
        <SideBarLeft isOpen={sidebar} onClose={handleClose} />
          {children}
    
      </main>
        <HomeFooter />
    </>
  )
}

export default BlogLayout