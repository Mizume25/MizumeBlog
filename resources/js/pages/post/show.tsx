import { IndexContent, type Content } from '@/types'
import { Head } from '@inertiajs/react'
import { useCallback, useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

import {
    PostBTN,
    PostContent,
    PostHeader,
    PostSideBarLeft,
    PostSideBarRight,
} from '../../core/post';
import Coments from '@/core/coments/Coments';
import { Formato } from '@/types/utils';
import { getFormatoPost } from '@/types/utils';
import BlogLayout from '@/layouts/app/blog-layout';
import SideBarRight from '@/core/auth/SideBarRight';

function show({ content }: { content: Content }) {




    const cover = `/IMG/Portada/${content.post.cover}`

    const formatDefault: Formato = {
        id: content.post.id,
        home_config: "center",
        article_config: "bg-[center_18%]",
    }

    const [format, setFormat] = useState<Formato | null>(formatDefault);

    useEffect(() => setFormat(content.post.config ?? null), [content.post.id]);



    console.log(format)
    const index: IndexContent[] = content.index;



    const [selectedId, setSelectedId] = useState<string>("puntos-capitales");

    const [menuAbierto, setMenuAbierto] = useState(false);


    const handleFindID = (id: string) => {
        setSelectedId(id);
    };

    const handleButtonClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        setMenuAbierto(prev => !prev);
    }, []);

    const isClose = () => {
        setMenuAbierto(false)
    }



    return (
        <BlogLayout post_id={content.post.id} index={content.index}>


            {/* Pestaña de la Página */}
            <Head title='Show'></Head>

            {/* Componente imagen header */}
            <PostHeader route={cover} title={content.post.title} format={format?.article_config} />

            <PostBTN onButtonClick={handleButtonClick} />
            {/* Contenedor del Main */}
            <main className="mt-20 max-w-[1700px] mx-auto px-4 sm:px-6 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start relative">
                    {menuAbierto && (
                        <div
                            className="lg:hidden fixed inset-0 z-[59] bg-black/50"
                            onClick={() => setMenuAbierto(false)}
                        />
                    )}

                    <PostSideBarLeft list={index} onFindID={handleFindID} menuAbierto={menuAbierto} id={content.post.id} isClose={isClose} />
                    <PostContent post={content.post} contenido={content.body} selectedId={selectedId} />
                    
                    <SideBarRight
                        posts={content.features}
                        featuredTitle="Artículos / Post Destacados"
                        showProfile
                        variant="light"
                        sticky="lg:top-24"
                        colSpan='lg:col-span-3'
                    />
                    <Coments coments={content.comments} post_id={content.post.id} />
                </div>
            </main>

        </BlogLayout>
    )
}

export default show