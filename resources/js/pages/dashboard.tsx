import { Head } from '@inertiajs/react';
import HomeHeader from '@/core/home/items/HomeHeader';
import HomeSideBarLeft from '@/core/home/items/HomeSideBarLeft';
import HomeSideBarRight from '@/core/home/items/HomeSideBarRight';
import {type Post} from '@/types';
import HomeContent from '@/core/home/items/HomeContent';
import { getRandomInt } from '@/lib/utils';
//Variable de estado 

//Contenido del Home
export default function Dashboard({ posts }: { posts: Post[] }) {
    //DECLARAMOS UN SET
    const webPosts = new Set<Post>();
    const max = Math.min(6, posts.length); // Seguridad: no pedir más de los que existen

    //ITERAMOS SET DE POSTS
    while (webPosts.size < max) {
        const id = getRandomInt(0, posts.length - 1);
        webPosts.add(posts[id]); // Si el post ya existe, el Set lo ignora automáticamente
    }

    //CREAMOS UN ARRAY POSTS NUEVO
    const featured : Post[] = Array.from(webPosts);

    console.log("Cargando Objetos", featured);
    return (
        <>
            {/* Head de el Home*/}
            <Head title='Home'></Head>
            <main className="container mx-auto max-w-[1500px] p-4 md:p-8 grid grid-cols-1 lg:grid-cols-[1fr_3fr_1fr] gap-8 items-start">

                {/*Header Layout*/}
                <HomeHeader />

                {/*SideBar izquierdo*/}
                <HomeSideBarLeft />


                {/*Contenido Body*/}
                <HomeContent featured={featured} />


                {/*SideBar derecho*/}
                <HomeSideBarRight featured={featured}/>

            </main>
        </>
    );
}
