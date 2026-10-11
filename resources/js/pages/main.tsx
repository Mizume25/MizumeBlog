
import React from 'react'
import {
  BlogLayout,
  BlogWidget
} from '@/layouts/app'
import { MotionCarousel } from '@/components/animate-ui/components/community/motion-carousel';
import { EmblaOptionsType } from 'embla-carousel';
import { PostRecord, PostsGroupedByUser, Work, WorkWithMedia } from '@/types/definitions';

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
    <div className="flex-1 gap-4 rounded-xl min-h-85 bg-mizume-secondary text-mizume-secondary-foreground flex flex-col lg:flex-row justify-center items-center p-4" >
      {children}
    </div>
  )
}

interface BlogCarouselProps {
  works: WorkWithMedia []
}

export type UserPostsSlide = {
  id_user: string;
  posts: PostRecord[];
};
const BlogCarousel = ({ works }: BlogCarouselProps) => {
  const OPTIONS: EmblaOptionsType = { loop: true };
  const SLIDE_COUNT = 6;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

 

  return <MotionCarousel slides={works} options={OPTIONS} />;
};

interface MainProps {
  works: WorkWithMedia [],
  posts: PostsGroupedByUser
}
function main({ works, posts }: MainProps) {

  
  return (
    <BlogLayout>
      <BlogWidgetWrap>
        <BlogWidget variant='work' />
        <BlogWidget variant='post' />
        <BlogWidget variant='author' />
      </BlogWidgetWrap>
      <BlogMain>
        <div className='w-full lg:w-[50%]  h-full border-4 rounded-2xl border-mizume-fourthary '>
          <BlogCarousel works={works} />
        </div>

        <div className='w-full lg:w-[50%] h-full p-4 rounded-2xl bg-mizume-fourthary'>

        </div>
      </BlogMain>
    </BlogLayout>
  )
}

export default main