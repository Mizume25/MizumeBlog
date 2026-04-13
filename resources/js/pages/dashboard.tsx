import { Head } from '@inertiajs/react';
import HomeHeader from '@/core/home/items/HomeHeader';
import HomeSideBarLeft from '@/core/home/items/HomeSideBarLeft';
import HomeSideBarRight from '@/core/home/items/HomeSideBarRight';
import { type Post } from '@/types';
import HomeContent from '@/core/home/items/HomeContent';
import { getRandomInt } from '@/lib/utils';
import HomeButton from '@/core/home/items/HomeButton';
import { useState, useEffect } from 'react';
import { ReactNode } from 'react';
//Variable de estado 

//Interfaces de Ids
export interface SideBarChange {
    sidebar: string,
    title: string,
}

export interface itemID {
    item: string[];
}

const btnId: string = "buttonMenu";

//Creamos el objeto
const ID_SIDE_BAR: SideBarChange = {
    sidebar: "sidebar-derecha",
    title: "title-right"
}

const ID_ITEM: itemID = {
    item: ["itemOne", "itemTwo", "itemThree"],
}

//Contenido del Home
export default function Dashboard({ posts }: { posts: Post[] }) {
    const [modoSidebar, setModoSidebar] = useState<'posts' | 'secciones'>('posts');
    // --- FUNCIONES DE CONTENIDO ---
    useEffect(() => {
        //FUNCIONALIDAD DEL SIDEBAR
        const btn = document.getElementById('buttonMenu') as HTMLButtonElement;
        const sidebar = document.getElementById('sidebar-derecha') as HTMLElement;
        const title = document.getElementById('title-right') as HTMLHeadingElement;
        const itemOne = document.getElementById('itemOne') as HTMLAnchorElement; // Si es un <a>
        const itemTwo = document?.getElementById('itemTwo') as HTMLAnchorElement;
        const itemThree = document?.getElementById('itemThree') as HTMLAnchorElement;

        // Definimos el breakpoint de 1024px (el mismo que lg: en Tailwind)
        const isMobile = window.matchMedia("(max-width: 1023px)");
        

        const setSectionsContent = () => {
            title.textContent = "Secciones";
            itemOne.textContent = "🐢 Sobre Autores";
            itemTwo.textContent = "🐢 Archivador";
            itemThree.textContent = "🐢 Intereses";
            // Aquí asignarías los href a las secciones del blog
            itemOne.href = "#sobre-autores";
            itemTwo.href = "#archivador";
            itemThree.href = "#intereses";
        };

        // --- LÓGICA DE EVENTOS ---

        btn.addEventListener('click', () => {
            // Solo ejecutamos lógica si estamos en resolución móvil
            if (isMobile.matches) {
                // Hacemos el movimiento (si tiene la clase se la quita, si no se la pone)
                sidebar.classList.toggle('translate-x-full');

                // Comprobamos si el sidebar SE ACABA DE ABRIR
                // Si NO tiene la clase 'translate-x-full', significa que está en pantalla
                if (!sidebar.classList.contains('translate-x-full')) {
                   setModoSidebar('secciones');
                } else {
                    // Cuando se cierra, podemos devolverlo al estado original
                   setModoSidebar('posts');
                }
            }
        });

        // Detectar cuando el usuario cambia el tamaño de la ventana (Resize)
        isMobile.addEventListener('change', (e) => {
            if (!e.matches) {
                // Si pasamos a Desktop (pantalla grande):
                 setModoSidebar('posts'); // Siempre mostrar posts en PC
                sidebar.classList.remove('translate-x-full'); // Asegurar que no esté movido
            } else {
                sidebar.classList.add('translate-x-full');
                setModoSidebar('posts');

            }
        });

        // Al cargar la página por primera vez, si es PC, forzamos contenido de posts
        if (!isMobile.matches) {
            setModoSidebar('posts');
        }
    }, []);

    //DECLARAMOS UN SET
    const webPosts = new Set<Post>();
    const max = Math.min(6, posts.length); // Seguridad: no pedir más de los que existen

    //ITERAMOS SET DE POSTS
    while (webPosts.size < max) {
        const id = getRandomInt(0, posts.length - 1);
        webPosts.add(posts[id]); // Si el post ya existe, el Set lo ignora automáticamente
    }

    //CREAMOS UN ARRAY POSTS NUEVO
    const featured: Post[] = Array.from(webPosts);

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
                    <HomeContent featured={featured} />


                    {/*SideBar derecho*/}
                    <HomeSideBarRight featured={featured} ID_SIDE_BAR={ID_SIDE_BAR} ID_ITEM={ID_ITEM} modo={modoSidebar} />

                </main>
            </>
        );
    }
