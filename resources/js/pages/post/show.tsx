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
import TopAuthBar from '@/core/auth/TopAuthBar';
import { Formato } from '@/types/utils';
import { getFormatoPost } from '@/types/utils';


function show({ content }: { content: Content }) {



    const cover = `/IMG/Portada/${content.post.cover}`

    const formatDefault: Formato = {
        id: content.post.id,
        home_config: "center",
        article_config: "bg-[center_18%]",
    }

    const [format, setFormat] = useState<Formato | null>(formatDefault);

    useEffect(() => {
        const fetchFormat = async () => {
            if (content.post.id) {
                try {
                    const data = await getFormatoPost(content.post.id);
                    setFormat(data);
                } catch (error) {
                    console.error("Error cargando formato:", error);
                }
            }
        };

        fetchFormat();
    }, [content.post.id])


   

    const index: IndexContent[] = content.index;


    const { auth } = usePage<SharedData>().props;

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
        <>
            {/* Pestaña de la Página */}
            <Head title='Show'></Head>
            {!auth?.user && <TopAuthBar />}
            {/* Componente imagen header */}
            <PostHeader route={cover} title={content.post.title} format={format?.article_config} />

            <PostBTN onButtonClick={handleButtonClick} />
            {/* Contenedor del Main */}
            <main className="mt-16 max-w-[1700px] mx-auto px-4 pb-20">

                {/* Articulo */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">
                    {menuAbierto && (
                        <div
                            className="lg:hidden fixed inset-0 z-[59] bg-black/50"
                            onClick={() => setMenuAbierto(false)}
                        />
                    )}
                    {/* Componente del SideBar Izquierdo */}
                    <PostSideBarLeft list={index} onFindID={handleFindID} menuAbierto={menuAbierto} id={content.post.id} isClose={isClose} />

                    <PostContent post={content.post} contenido={content.body}  selectedId={selectedId} />

                    {/* Componente del SideBar Derecho */}
                    <PostSideBarRight id={content.post.id} />

                    <Coments coments={content.comments} post_id={content.post.id} />


                </div>

            </main>

        </>
    )
}

export default show