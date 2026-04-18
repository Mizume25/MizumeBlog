import { Head } from '@inertiajs/react';
import { type Post } from '@/types';
import { getRandomInt, getRandomPost } from '@/lib/utils';
import { useState, useEffect , useMemo , useCallback } from 'react';
import { 
    HomeHeader, 
    HomeSideBarLeft, 
    HomeSideBarRight, 
    HomeContent, 
    HomeButton, 
    HomeSidebarMobile 
} from '../core/home';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import TopAuthBar from '@/core/auth/TopAuthBar';
 
//INTERFACES PARA LOS COMPONENTES
export interface SideBarChange { // HomeSideBarRight
    sidebar: string,
    title: string,
    list: Post[] | undefined,
}

//Interfaz de sidebar Defailt
export interface DefaultSideBar {
    title: string,
    items: string[],
    routes: string[],
}



// Versión SUPER SIMPLE de useMediaQuery
    const useMediaQuery = (query:string) => {
        const [matches, setMatches] = useState(false);

        useEffect(() => {
            const media = window.matchMedia(query);

            // Actualizar el estado inicial
            if (media.matches !== matches) {
                setMatches(media.matches);
            }

            // Definir el listener para cambios de pantalla
            const listener = () => setMatches(media.matches);

            // Soporte para navegadores modernos y antiguos
            media.addEventListener('change', listener);

            return () => media.removeEventListener('change', listener);
        }, [matches, query]);

        return matches;
    };

//Contenido del Home
export default function Dashboard({ posts }: { posts: Post[] }) {
    const MAX_POST: number = 6;
    const [menuAbierto, setMenuAbierto] = useState(false);
    const { auth } = usePage<SharedData>().props;
    
    const { mainPosts, sidebarPosts } = useMemo(() => {
        const featured = getRandomPost(MAX_POST, posts);
        return {
            mainPosts: featured?.slice(0, 3),
            sidebarPosts: featured?.slice(3)
        };
    }, [posts]); // Solo se recalcula si 'posts' cambia
    
    const CONTENT = useMediaQuery("(max-width: 1024px)");

   

    // Botón toggle simple
    const handleButtonClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
        setMenuAbierto(prev => !prev);
    }, []);

    //Boton de solo cerrar 
    const handleClose = useCallback(() => {
    setMenuAbierto(false);
    }, []);

    const exist : boolean = auth?.user ? true : false;

    return (
        <>
            {/* Head de el Home*/}
            <Head title='Home' ></Head>
            {!auth.user && <TopAuthBar />}
            {/* Bottton del Responsive */}
            <HomeButton onButtonClick={handleButtonClick} />
            <main className="container mx-auto max-w-[1500px] p-4 md:p-8 grid grid-cols-1 lg:grid-cols-[1fr_3fr_1fr] gap-8 items-start">
             
                {/*Header Layout*/}
                <HomeHeader />

                {/*SideBar izquierdo*/}
                <HomeSideBarLeft exist={exist}/>


                {/*Contenido Body*/}
                <HomeContent mainPosts={mainPosts} />

                {CONTENT && (
                    <HomeSidebarMobile isOpen={menuAbierto} onClose={handleClose}/>
                )}

                {/*SideBar derecho*/}
                <HomeSideBarRight sidebarPosts={sidebarPosts} />

            </main>
        </>
    );
}
