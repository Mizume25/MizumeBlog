import { Comentario, Post } from '@/types'
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
import { getRoutePortada } from '@/types/utils';

export interface Index {
  id: string,
  titulo: string,
}

function show({ post, index, contenido, coments }: { post: Post, index: Index[], contenido: string , coments:Comentario []  }) {

  const ruta = getRoutePortada(post?.categoria , post?.portada);

  const formatDefault : Formato = {
          id:post?.id,
          home_config:"center",
          article_config:"bg-[center_18%]",
  }

  const [format, setFormat] = useState<Formato | null>(formatDefault);

  useEffect(() => {
        const fetchFormat = async () => {
            if (post?.id) {
                try {
                    const data = await getFormatoPost(post.id);
                    setFormat(data);
                } catch (error) {
                    console.error("Error cargando formato:", error);
                }
            }
        };

        fetchFormat();
    }, [post?.id])


  console.log(format)

  const list: Index[] = index;
  const { auth } = usePage<SharedData>().props;

  const [selectedId, setSelectedId] = useState<string>("puntos-capitales");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const handleFindID = (id: string) => {
        console.log("El hijo me ha enviado el ID:", id);
        setSelectedId(id); 
    };
  
  const handleButtonClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          e.stopPropagation();
          
          setMenuAbierto(prev => !prev);
      }, []);
 
  return (
    <>
        {/* Pestaña de la Página */}
        <Head title='Show'></Head>
        {!auth?.user && <TopAuthBar />}
        {/* Componente imagen header */}
        <PostHeader route={ruta} title={post.titulo} format={format?.article_config} />

        <PostBTN onButtonClick={handleButtonClick} />
        {/* Contenedor del Main */}
        <main className="mt-16 max-w-[1700px] mx-auto px-4 pb-20">

        {/* Articulo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">

        {/* Componente del SideBar Izquierdo */}
        <PostSideBarLeft list={list} onFindID={handleFindID} menuAbierto={menuAbierto} id={post.id}/>

        <PostContent post={post} contenido={contenido} index={index} selectedId={selectedId} />

        {/* Componente del SideBar Derecho */}
        <PostSideBarRight id={post.id} />

        <Coments coments={coments} post_id={post.id}/>
        

        </div>

      </main>

    </>
  )
}

export default show