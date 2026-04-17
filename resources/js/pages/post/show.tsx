import { Post } from '@/types'
import { Head } from '@inertiajs/react'
import { useCallback, useState } from 'react';

import { 
    PostBTN, 
    PostContent, 
    PostHeader, 
    PostSideBarLeft, 
    PostSideBarRight,  
} from '../../core/post';
import Coments from '@/core/coments/Coments';

export interface Index {
  id: string,
  titulo: string,
}

function show({ post, index, contenido }: { post: Post, index: Index[], contenido: string }) {


  const list: Index[] = index;

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

        {/* Componente imagen header */}
        <PostHeader route={post?.ruta} title={post.titulo} />

        <PostBTN onButtonClick={handleButtonClick} />
        {/* Contenedor del Main */}
        <main className="mt-16 max-w-[1700px] mx-auto px-4 pb-20">

        {/* Articulo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Componente del SideBar Izquierdo */}
        <PostSideBarLeft list={list} onFindID={handleFindID} menuAbierto={menuAbierto} />

        <PostContent post={post} contenido={contenido} index={index} selectedId={selectedId} />

        {/* Componente del SideBar Derecho */}
        <PostSideBarRight id={post.id} />

        <Coments />
        

        </div>

      </main>

    </>
  )
}

export default show