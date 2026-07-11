import { Head } from '@inertiajs/react';
import { type Post } from '@/types';
import { getRandomPost } from '@/lib/utils';
import { useState, useMemo, useCallback } from 'react';
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
import BlogLayout from '@/layouts/app/blog-layout';
import SideBarLeft from '@/core/auth/SideBarLeft';
import SideBarRight from '@/core/auth/SideBarRight';

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
    const handleClose = useCallback(() => setMenu(false), []);

    return (
        <BlogLayout>
            {/* Head de el Home*/}
            <Head title='Home' ></Head>




            <main className="container mx-auto max-w-[1500px] p-4 md:p-8 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 items-start">

                <HomeContent mainPosts={mainPosts} className="order-2 lg:order-1" />

                <SideBarRight posts={sidebarPosts} showFollow sticky="lg:top-6" className="order-1 lg:order-2" />

            </main>

          
        </BlogLayout>
    );
}
