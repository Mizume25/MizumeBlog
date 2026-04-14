import { Head } from '@inertiajs/react';
import HomeHeader from '@/core/home/items/HomeHeader';
import HomeSideBarLeft from '@/core/home/items/HomeSideBarLeft';
import HomeSideBarRight from '@/core/home/items/HomeSideBarRight';
import { type Post } from '@/types';
import HomeContent from '@/core/home/items/HomeContent';
import { getRandomInt, getRandomPost } from '@/lib/utils';
import HomeButton from '@/core/home/items/HomeButton';
import { useState, useEffect } from 'react';
import { ReactNode } from 'react';
import HomeSidebarMobile from '@/core/home/items/HomeSidebarMobile';

//INTERFACES PARA LOS COMPONENTES
export interface SideBarChange { // HomeSideBarRight
    sidebar: string,
    title: string,
    list: Post[] | undefined ,
}

//Interfaz de sidebar Defailt
export interface DefaultSideBar {
    title: string,
    items:string[],
    routes:string[],
}

const DEFAULT : DefaultSideBar = {
    title: "Secciones",
    items: ["🐢 Sobre Autores"," 🐢 Archivador","🐢 Intereses"],
    routes: ["#","#","#"],
}

//OBJETOS PARA LOS COMPONENTES 
const btnId: string = "buttonMenu"; // HomeButton

//Contenido del Home
export default function Dashboard({ posts }: { posts: Post[] }) {

    function useMediaQuery(query : string) {
        const [matches, setMatches] = useState(false);

        useEffect(() => {
            const media = window.matchMedia(query);
            if (media.matches !== matches) {
                setMatches(media.matches);
            }
            const listener = () => setMatches(media.matches);
            media.addEventListener('change', listener);
            return () => media.removeEventListener('change', listener);
        }, [matches, query]);

        return matches;
    }

    const CONTENT:boolean = useMediaQuery("(max-width: 1024px)");

    const [menuAbierto, setMenuAbierto] = useState(false);

    const MAX_POST: number = 6;

    const featured: Post[] | undefined = getRandomPost(MAX_POST, posts);

    const mainPosts : Post[] | undefined = featured?.slice(0, 3);

   
    
    // Del tercero en adelante para el sidebar
    const sidebarPosts : Post[] | undefined  = featured?.slice(3);

   
    return (
        <>
            {/* Head de el Home*/}
            <Head title='Home'></Head>

            {/* Bottton del Responsive */}
            <HomeButton btnId={btnId} />

            <main className="container mx-auto max-w-[1500px] p-4 md:p-8 grid grid-cols-1 lg:grid-cols-[1fr_3fr_1fr] gap-8 items-start">

                {/*Header Layout*/}
                <HomeHeader />

                {/*SideBar izquierdo*/}
                <HomeSideBarLeft />


                {/*Contenido Body*/}
                <HomeContent mainPosts={mainPosts} />

                {CONTENT && (
                    <HomeSidebarMobile isOpen={menuAbierto} onClose={() => setMenuAbierto(false)}/>     
                )}

                {/*SideBar derecho*/}
                <HomeSideBarRight sidebarPosts={sidebarPosts} />

            </main>
        </>
    );
}
