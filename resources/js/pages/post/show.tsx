
/** Interfaces web utilizadas */
import { IndexContent, type Content , Formato , formatDefault } from '@/types'

/** Eestados e iconos react */
import { Head } from '@inertiajs/react'
import { ListTree } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

/** COMPONENTES  */
import {
    PostContent,
    PostSideBarLeft,
} from '../../core/post';
import Coments from '@/core/coments/Coments';
import BlogLayout from '@/layouts/app/blog-layout';
import SideBarRight from '@/core/auth/SideBarRight';

/**
 * 
 * @param routa Ruta de la imagen 
 * @param title Titulo de el post
 * @param formato Formato de imagen
 * @returns 
 */
function PostHeader({ route, title, format }: { route: string | undefined, title: string, format?: string }) {
  return (
    <>
      {/* Imagen de la obra */}
      <header
        className={`w-full h-[35vh] bg-no-repeat bg-cover ${format}`}
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${route})`
        }}
      >
      </header>

      {/* Titulo de la obra */}
      <div className="relative z-10 flex justify-center -mt-10 px-4">
        <div className="w-full max-w-4xl bg-[#C8AD7F] py-4 rounded-xl shadow-lg border border-[#b39a6f] text-center">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-wide uppercase title ">
            {title}
          </h2>
        </div>
      </div>
    </>
  )
}

/**
 * Boton Indice para Post 
 * @param Function Funcion para abrir y cerrar SideBar
 * @returns 
 */
function PostBTN({ onOpen }: { onOpen?: (e: React.MouseEvent<HTMLButtonElement>) => void }) {

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => onOpen?.(e);


    return (
        <button
            onClick={handleClick}
            className="lg:hidden fixed top-[58px] sm:top-[42px] right-2 z-40 bg-[#754C22] p-2.5 rounded-lg shadow-lg border border-white/20 active:scale-95 transition-all cursor-pointer mt-10">
            <div className="space-y-1.5">
                <ListTree size={22} className='text-white' />
            </div>
        </button>
    )
}




function show({ content }: { content: Content }) {

    /** Ruta de la Portada */
    const cover = `/IMG/Portada/${content.post.cover}`
    
    
    /** Formato de la portada */
    const [format, setFormat] = useState<Formato | null>(formatDefault);

    /** Formato de la portada renderizada a estado  */
    useEffect(() => setFormat(content.post.config ?? null), [content.post.id]);


    console.log(content)
    /** Indice de Contenido */
    const index: IndexContent[] = content.index;


    /** Punto del indice selecionado */
    const [selectedId, setSelectedId] = useState<string>("puntos-capitales");

    /** Sidebar del Indice */
    const [sidebar, setSidebar] = useState(false);

    /** Iteración de indice */
    const handleFindID = (id: string) => setSelectedId(id);
    
    /** Toogle de cerrado */
    const onOpen = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        setSidebar(prev => !prev);
    }, []);

    /** Cerrado de Indice */
    const isClose = () => setSidebar(false)
    



    return (
        <BlogLayout post_id={content.post.id} >


            {/* Pestaña de la Página */}
            <Head title='Show'></Head>

            {/* Componente imagen header */}
            <PostHeader route={cover} title={content.post.title} format={format?.article_config} />

            {/** Componente para indice button */}
            <PostBTN onOpen={onOpen} />
            
            {/* Contenedor del Main */}
            <main className="mt-20 max-w-[1700px] mx-auto px-4 sm:px-6 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start relative">
                  

                    <PostSideBarLeft list={index} onFindID={handleFindID} sidebar={sidebar} isClose={isClose} post_id={content.post.id} />
                    
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