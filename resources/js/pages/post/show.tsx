import PostHeader from '@/core/post/PostHeader'
import PostTitle from '@/core/post/PostTitle'
import { Post } from '@/types'
import { Head } from '@inertiajs/react'


function show({ post, index , contenido }: { post: Post, index:string , contenido:string }) {


    
    console.log(contenido);

  return (
    <>
    
        <Head title='Show'></Head>

        <main className="mt-16 container mx-auto px-4 pb-20">

        {/* Componente imagen header */}
        <PostHeader route={post?.ruta} title={post.titulo}/>

        {/* Componente Titulo */}
        <PostTitle title={post.titulo} data={post.fecha_publicacion} webtitle={post?.web_title} autor={post.autor} />
        
      
        


          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          </div>

        </main>
   
    </>
  )
}

export default show