
import React from 'react'
import {
  BlogLayout,
  BlogWidget
} from '@/layouts/app'
import { MotionCarousel } from '@/components/animate-ui/components/community/motion-carousel';
import { EmblaOptionsType } from 'embla-carousel';
import { PostsGroupedByUser, Work } from '@/types/definitions';
import { CustomPropType } from '@/components/animate-ui/components/community/motion-carousel';
interface BlogContentProps {
  children: React.ReactNode
}

/** Contenedor Superior */
export const BlogWidgetWrap = ({ children }: BlogContentProps) => {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3" >
      {children}
    </div>
  )
}

/**
 * Contenedor Inferior
 * @param param0 
 * @returns 
 */
export const BlogMain = ({ children }: BlogContentProps) => {
  return (
    <div className="flex-1 rounded-xl min-h-85 bg-mizume-secondary text-mizume-secondary-foreground flex flex-row justify-center items-center p-4" >
      {children}
    </div>
  )
}
 const BlogCarousel = ( { posts } : PostsGroupedByUser) => {
    const OPTIONS: EmblaOptionsType = { loop: true };
    const SLIDE_COUNT = 6;
    const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

  
  
    return <MotionCarousel slides={SLIDES} options={OPTIONS}   />;
  };

interface MainProps {
  works: Work [],
  posts: PostsGroupedByUser 
}
function main( { works, posts } : MainProps) {

  
  return (
    <BlogLayout>
      <BlogWidgetWrap>
        <BlogWidget variant='work' />
        <BlogWidget variant='post' />
        <BlogWidget variant='author' />
      </BlogWidgetWrap>
      <BlogMain>
        <div className='w-[50%] h-full   border-4 rounded-2xl border-black '>
            <BlogCarousel />
        </div>

        <div className='w-[50%] h-full p-4'>

        </div>
      </BlogMain>
    </BlogLayout>
  )
}

export default main