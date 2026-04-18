import { Post } from '@/types'
import React from 'react'
import PostTag from './PostTag';
import PostTitle from './PostTitle';
import MarkdownRenderer from './MarkdownRenderer';
import { Index } from "@/pages/post/show";
import rehypeSlug from 'rehype-slug';
function PostContent({ post, contenido, index, selectedId }: { post: Post, contenido: string , index:Index[], selectedId:string }) {

  const tags: string[] | undefined = post?.genero.split(',').map(p => p.trim());
  

  return (
    /* Contenido Main*/
    <article className="lg:col-span-6 bg-[#2A1B12]/95 rounded-lg border border-white/10 shadow-2xl overflow-hidden ps-4 pe-4">

      {/* Contenedor de Tags*/}
      <PostTag tags={tags} />

      <PostTitle data={post.fecha_publicacion} webtitle={post.web_title} autor={post.autor} />

      <MarkdownRenderer
        content={contenido}
        className="mb-12"
        selectedId={selectedId}
      />

    </article>
  )
}

export default PostContent