import { Head } from '@inertiajs/react';
import { type Post } from '@/types';
import { useMemo } from 'react';
import { HomeContent, } from '../core/home';


/** @imports Layouts Reciclables */
import BlogLayout from '@/layouts/app/blog-layout';
import SideBarRight from '@/core/auth/SideBarRight';

export default function Dashboard({ posts }: { posts: Post[] }) {



    /***
     * Conteido Destacado
     * Dividmos el contendo 3 
     */
    const { mainPosts, sidebarPosts } = useMemo(() => {
        return {
            mainPosts: posts.slice(0, 3),
            sidebarPosts: posts.slice(3)
        };

    }, [posts]);


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
