import { IndexContent, Post } from '@/types'
import PostTag from './PostTag';
import PostTitle from './PostTitle';
import MarkdownRenderer from './MarkdownRenderer';


function PostContent({ post, contenido, selectedId }: { post: Post, contenido: string , selectedId:string }) {

  const badge: string[] = post.gender.split(',').map(p => p.trim());
  

  return (
    /* Contenido Main*/
    <article className="lg:col-span-6 bg-[#2A1B12]/95 rounded-lg border border-white/10 shadow-2xl overflow-hidden ps-4 pe-4">

      {/* Contenedor de Tags*/}
      <PostTag tags={badge} />

      <PostTitle data={post.publish_date} webtitle={post.web_title} autor={post.author} />

      <MarkdownRenderer
        content={contenido}
        className="mb-12"
        selectedId={selectedId}
      />

    </article>
  )
}

export default PostContent