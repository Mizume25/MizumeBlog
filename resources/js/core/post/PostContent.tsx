import { Post } from '@/types'
import MarkdownRenderer from './MarkdownRenderer';


/**
 * Formatear Fecha
 * @param data 
 * @returns 
 */
const formatDate = (data :string | undefined) => {
    if(!data) return;
        // 1. Creamos el objeto fecha (asegurándote de que el string sea YYYY-MM-DD)
        const fecha = new Date(data);

        // 2. Usamos el formateador de Intl
        return new Intl.DateTimeFormat('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(fecha);
};

/**
 * Titulo de Post
 * @param param0 
 * @returns 
 */

type PostTitleProps = Pick<Post, "publish_date" | "web_title" | "author">;

function PostTitle({publish_date, web_title, author }: PostTitleProps ) {
    let newDate: string  | undefined = formatDate(publish_date);
    return (
        <header className="px-8 pb-4 text-center">
            <div className="bg-[#C8AD7F] py-8 px-6 rounded-xl shadow-lg mb-6 relative">
                <h1 className="capitalize text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
                   { web_title || `Lectura de ${author}`}
                </h1>

            </div>
            <p className="text-[#A18B75] italic text-sm mb-4">Publicado el {newDate}</p>
            <div className="w-24 h-px bg-white/20 mx-auto mb-8"></div>
        </header>
    )
}


function PostTag({ tags }: { tags: string[] }) {
   return (
      //Mapeamos tags
      <div className="flex justify-center gap-2 sm:gap-3 px-3 py-3 sm:px-6 sm:py-6 bg-[#2A1B12] capitalize">
         {tags.map((p, i) => (
            <span
               key={i}
               className="bg-[#d9d9d9] text-black px-3 py-1.5 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-[20px] text-sm sm:text-base lg:text-lg font-bold shadow-sm whitespace-nowrap"
            >
               {p}
            </span>
         ))}
      </div>
   )
}


function PostContent({ post, contenido, selectedId }: { post: Post, contenido: string , selectedId:string }) {

  const badge: string[] = post.tags.split(',').map(p => p.trim());
  

  return (
    /* Contenido Main*/
    <article className="lg:col-span-6 bg-[#2A1B12]/95 rounded-lg border border-white/10 shadow-2xl overflow-hidden ps-4 pe-4">

      {/* Contenedor de Tags*/}
      <PostTag tags={badge} />

      {/** Titulo Header */}
      <PostTitle 
      publish_date={post.publish_date} 
      web_title={post.web_title} 
      author={post.author}
      
      />
      
      {/** Renderizado de contenido */}
      <MarkdownRenderer
        content={contenido}
        className="mb-12"
        selectedId={selectedId}
      />

    </article>
  )
}

export default PostContent