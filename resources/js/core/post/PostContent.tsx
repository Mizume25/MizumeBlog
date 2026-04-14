import { Post } from '@/types'
import React from 'react'

function PostContent({ post, index } : { post:Post, index:string[]}) {
  return (
    /* Contenido Main*/
     <article className="lg:col-span-6 bg-[#2A1B12]/95 rounded-lg border border-white/10 shadow-2xl overflow-hidden font-['Lexend']">
        
        {/* Contenedor de Tags*/}
        <div className="flex justify-center gap-3 p-6">
                
        </div>



    </article>
  )
}

export default PostContent