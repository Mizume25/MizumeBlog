import { Head } from '@inertiajs/react';
import { type Post } from '@/types';
import { getRandomPost } from '@/lib/utils';
import { useState , useMemo , useCallback } from 'react';
import { 
    HomeHeader, 
    HomeSideBarLeft, 
    HomeSideBarRight, 
    HomeContent, 
    HomeButton, 
} from '../core/home';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import TopAuthBar from '@/core/auth/TopAuthBar';
import HomeFooter from '@/core/home/HomeFooter';

export default function Dashboard({ posts }: { posts: Post[] }) {
    
   
    const [menu, setMenu] = useState(false);
    const { auth } = usePage<SharedData>().props;

    /***
     * Conteido Destacado
     */
    const { mainPosts, sidebarPosts } = useMemo(() => {
        return {
            mainPosts: posts.slice(0, 3),
            sidebarPosts: posts.slice(3)
        };

    }, [posts]);


   

    /**
     * @param e 
     * Evento click que activa el menu responsive
     */
    const handleButtonClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        e.stopPropagation();

        setMenu(prev => !prev)

    }, []);

    /***
     * Cierra el menu tras la acivacion de una funcion
     */
    const handleClose = useCallback(() => setMenu(false) , []);

    return (
        <>
            {/* Head de el Home*/}
            <Head title='Home' ></Head>

            {/* Top bar de innicio de sessión */}
            {!auth?.user && <TopAuthBar />}


            {/* Bottton del Responsive */}
            <HomeButton onButtonClick={handleButtonClick} />
            <main className="container mx-auto max-w-[1500px] p-4 md:p-8 grid grid-cols-1 lg:grid-cols-[1fr_3fr_1fr] gap-8 items-start">
             
                {/*Header Layout*/}
                <HomeHeader />

                {/*SideBar izquierdo*/}
                <HomeSideBarLeft isOpen={menu} onClose={handleClose} />


                {/*Contenido Body*/}
                <HomeContent mainPosts={mainPosts} />

                

                {/*SideBar derecho*/}
                <HomeSideBarRight sidebarPosts={sidebarPosts} />

            </main>

                <HomeFooter />
        </>
    );
}
