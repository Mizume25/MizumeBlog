import PostContent from '@/core/post/PostContent';
import PostHeader from '@/core/post/PostHeader'
import PostSideBarLeft from '@/core/post/PostSideBarLeft';
import PostSideBarRight from '@/core/post/PostSideBarRight';
import PostTitle from '@/core/post/PostTitle'
import { Post } from '@/types'
import { Head } from '@inertiajs/react'
import { useState } from 'react';

export interface Index {
  id: string,
  titulo: string,
}

function show({ post, index, contenido }: { post: Post, index: Index[], contenido: string }) {


  const list: Index[] = index;

  const [selectedId, setSelectedId] = useState<string>("puntos-capitales");
  
  const handleFindID = (id: string) => {
        console.log("El hijo me ha enviado el ID:", id);
        setSelectedId(id); 
    };

 
  return (
    <>
        {/* Pestaña de la Página */}
        <Head title='Show'></Head>

        {/* Componente imagen header */}
        <PostHeader route={post?.ruta} title={post.titulo} />


       

        {/* Contenedor del Main */}
        <main className="mt-16 max-w-[1700px] mx-auto px-4 pb-20">

        {/* Articulo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Componente del SideBar Izquierdo */}
        <PostSideBarLeft list={list} onFindID={handleFindID}/>

        <PostContent post={post} contenido={contenido} index={index} selectedId={selectedId} />

        {/* Componente del SideBar Derecho */}
        <PostSideBarRight />


        

        </div>

      </main>

    </>
  )
}

export default show