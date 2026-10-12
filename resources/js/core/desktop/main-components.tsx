/**
 * Componentes de main.tsx
 */


import React from 'react'
import {
  BlogLayout,

} from '@/layouts/app'
import { MotionCarousel } from '@/components/animate-ui/components/community/motion-carousel';
import { EmblaOptionsType } from 'embla-carousel';
import { PostRecord, PostsGroupedByUser, Work, WorkRecord } from '@/types/definitions';
import { BookBookmark, NotebookTextIcon, UserCircle2, TurtleIcon } from 'lucide-react'
import { formatDate } from '@/lib/utils';
import { number } from 'zod';
/**
 *  Interfaces necesarias para la pagina
 */
export type WidgetType = "author" | "work" | "post" // Tipados de widget

export interface BlogWidgetProps {
  variant: WidgetType
}

/**
 * Tipo de Secciones
 */

export type SectionProps = "left" | "right"

/** Interfaz de Blog Section Prop */
export interface BlogSectionProps {
  variant: SectionProps,
  works: WorkRecord[]
  work: WorkRecord,
  posts: PostsGroupedByUser
  changeWork: (work : WorkRecord) => void
}

/** Interfaz de Blog props */
export interface BlogCarouselProps {
  works: WorkRecord[]
  changeWork: (work : WorkRecord) => void
}



/** Interfaz Principal */
export interface MainProps {
  works: WorkRecord[],
  posts: PostsGroupedByUser
}

/**
 * Contenido hechos prop
 */
export interface BlogContentProps {
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
    <>
      <h2>Destacadas</h2>
      <div className="flex-1 gap-4 rounded-xl min-h-85 bg-mizume-secondary text-mizume-secondary-foreground flex flex-col lg:flex-row justify-center items-center p-4" >
        {children}
      </div>
    </>
  )
}


interface BlogSectionContentProps {
  work: WorkRecord,
  posts: PostsGroupedByUser
}



const BlogSectionContent = ({ work, posts }: BlogSectionContentProps) => {


  /**
   * Exclusion de propiedades iterables de work
   */
  const WORK_EXCLUDE = [
    "id", "created_at", "updated_at", "title", "sinopsi",
    "abbreviation", "tags", "media", "pivot", "cover_url",
  ] as const;

  type WorkExclude = (typeof WORK_EXCLUDE)[number];

  return (
    <div className='w-full h-full p-4 flex flex-col justify-center items-center gap-4'>
      <div className='w-full min-h-15 flex flex-col lg:flex-row justify-between items-center rounded-2xl bg-mizume-primary sm:p-4'>
        <div className='w-full lg:w-[50%] h-full  flex flex-row justify-center lg:justify-start items-center  px-6'>
          <h2 className='title text-xl'>{work.title}</h2>
        </div>
        <div className='w-full lg:w-[50%] h-full  flex flex-row justify-center items-center px-6'>
          <select className='bg-mizume-secondary  w-full h-8 rounded-2xl px-3'>
            <option className='text-mizume-primary-foreground text-md' value="">hola</option>
          </select>
        </div>

      </div>
      <div className="w-full min-h-75 bg-mizume-primary p-4 rounded-2xl text-black flex flex-col lg:flex-row">
        <div className="w-full lg:w-[50%] h-full sm:text-sm lg:border-r-2 border-black flex flex-col gap-6 min-w-0 p-4">
          {Object.entries(work).map(([key, value]) => {
            if ((WORK_EXCLUDE as readonly string[]).includes(key)) return null;
            if (typeof value === "object") return null
            if (Array.isArray(value)) return null;
            const styles = key === "sinopsi" ? "text-[12px]" : ""

            const VALUE = key === "publish_date" && typeof value === "string" ? formatDate(value) : value;


            return (
              <div key={key} className="w-full h-10 flex flex-row justify-start items-center gap-2">
                <h3 className="lg:text-xl capitalize">{key}:</h3>
                <div className="bg-mizume-secondary p-2 rounded-lg">
                  <p className={`text-white ${styles} capitalize text-sm`}>{VALUE}</p>
                </div>
              </div>
            );
          })}

          <div className="w-full grid grid-cols-3 gap-2 mt-2">
            {work.tags.map((tag) => (
              <div key={tag.id} className="bg-mizume-secondary p-2 rounded-lg flex items-center justify-center">
                <p className="text-white text-xs text-center">{tag.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-[50%] h-full min-w-0 overflow-hidden">
          <div className="w-full h-full flex flex-col items-start justify-start p-4 gap-2 text-center">
            <h2 className="text-xl font-bold">Sinopsi</h2>
            <p className="text-sm leading-relaxed break-all text-start">
              {work.sinopsi}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

}



export const BlogSection = ({ variant, works, work, posts, changeWork }: BlogSectionProps) => {
  const style = variant === "left" ? "border-mizume-fourthary" : "bg-mizume-fourthary border-mizume-primary"
  const component = variant === "left" ? <BlogCarousel works={works} changeWork={changeWork} /> : <BlogSectionContent posts={posts} work={work} />

  return (
    <div className={`w-full lg:w-[50%] h-full border-4 rounded-2xl ${style}`}>
      {component}
    </div>
  );
}



const BlogCarousel = ({ works, changeWork }: BlogCarouselProps) => {
  const OPTIONS: EmblaOptionsType = { loop: true };
  const SLIDE_COUNT = 6;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());



  return <MotionCarousel slides={works} options={OPTIONS} changeWork={changeWork} />;
};



export const BlogWidget = ({ variant }: BlogWidgetProps) => {

  const content = "flex flex-col justify-center items-center transition-transform hover:scale-115 cursor-pointer duration-300"
  const figure = "text-mizume-tertiary w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36"
  const subtitle = "title text-2xl"

  const RenderTypeIcon = () => {
    switch (variant) {
      case "author":
        return (
          <figure className={content}>
            <UserCircle2 size={150} className={figure} />
            <h3 className={subtitle}>Autores</h3>
          </figure>
        )
      case "post":
        return (
          <figure className={content}>
            <NotebookTextIcon size={150} className={figure} />
            <h3 className={subtitle}>Posts</h3>
          </figure>
        )
      case "work":
        return (
          <figure className={content}>
            <BookBookmark size={150} className={figure} />
            <h3 className={subtitle}>Obras</h3>
          </figure>
        )
      default:
        return (
          <figure className={content}>
            <TurtleIcon size={150} className={figure} />
            <h3 className={subtitle}>Not Found</h3>
          </figure>
        )
    }
  }


  return (
    <div className="aspect-video rounded-xl bg-mizume-secondary flex justify-center items-center p-4 hover:bg-mizume-primary transition-transform duration-500 ease-in-out">
      <RenderTypeIcon />
    </div>
  )
}