/**
 * Componentes de main.tsx
 */
import React from 'react'
import { Fragment } from 'react'
import { MotionCarousel } from '@/components/animate-ui/components/community/motion-carousel';
import { EmblaOptionsType } from 'embla-carousel';
import { PostsGroupedByUser, User, WorkRecord } from '@/types/definitions';
import { BookBookmark, NotebookTextIcon, UserCircle2, TurtleIcon } from 'lucide-react'
import { formatDate } from '@/lib/utils';
import { DATA_MAIN } from '@/pages/main';

/**
 *  Interfaces necesarias para la pagina
 */
export type WidgetType = "author" | "work" | "post" // Tipados de widget

export interface BlogWidgetProps {
  variant: WidgetType,
  content: DATA_MAIN
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
  changeWork: (work: WorkRecord) => void
  users: User[],
  content: DATA_MAIN,
}

/** Interfaz de Blog props */
export interface BlogCarouselProps {
  works: WorkRecord[]
  changeWork: (work: WorkRecord) => void
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
    <div className="grid w-full auto-rows-min grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4" >
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
      <div className="flex w-full min-w-0 max-w-8xl mx-auto min-h-85 flex-col-reverse items-stretch justify-center gap-4 rounded-xl bg-mizume-secondary p-4 text-mizume-secondary-foreground lg:flex-row lg:items-center" >
        {children}
      </div>
    </>
  )
}


interface BlogSectionContentProps {
  work: WorkRecord,
  posts: PostsGroupedByUser,
  users: User[],
  content: DATA_MAIN,
}





const WORK_EXCLUDE = [
  "id", "created_at", "updated_at", "title", "sinopsi",
  "abbreviation", "tags", "media", "pivot", "cover_url",
] as const

const BlogSectionContent = ({ work, users, content }: BlogSectionContentProps) => {

  console.log(work)
  return (
    <div className="flex h-full w-full flex-col gap-4 p-3 sm:p-4">
      <div className="flex w-full flex-col items-center justify-between gap-2 rounded-2xl bg-mizume-primary p-3 sm:p-4 lg:flex-row lg:gap-4">
        <h2 className="title min-w-0 text-center text-xl lg:w-1/2 lg:text-start">
          {work.title}
        </h2>
        <select
          aria-label="Autor"
          className="h-9 w-full min-w-0 truncate rounded-2xl bg-mizume-secondary px-3 text-sm lg:w-1/2"
        >
          {users.map((p) => (
            <option key={p.id} value={p.id} className="text-sm">
              {p.name}
            </option>
          ))}
        </select>
      </div>


      <div className="flex w-full flex-1 flex-col gap-4 rounded-2xl bg-mizume-primary p-3 text-black sm:p-4 lg:flex-row lg:gap-0 lg:p-6">

        <div className="flex min-w-0 flex-col gap-3 border-b-2 border-black pb-4 lg:w-1/2 lg:justify-start  lg:gap-5 lg:border-b-0 lg:border-r-2 lg:pb-0 lg:pr-6">
          <dl className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 lg:gap-y-4">
            {Object.entries(work).map(([key, value]) => {
              if ((WORK_EXCLUDE as readonly string[]).includes(key)) return null
              if (typeof value === "object" && key != "authors") return null


              let VALUE: string

              if (key === "publish_date" && typeof value === "string") {
                VALUE = formatDate(value)
              } else if (key === "authors" && Array.isArray(value)) {
                VALUE = value.map((a) => a.name).join(", ")
              } else {
                VALUE = String(value).replaceAll("_", " ")
              }


              return (
                <Fragment key={key}>
                  <dt className="text-sm capitalize lg:text-lg">
                    {ChangeKey(key, content)}
                  </dt>
                  <dd className="justify-self-start break-words rounded-lg bg-mizume-secondary px-2 py-1 text-sm capitalize text-white lg:px-3 lg:text-base">
                    {VALUE}
                  </dd>
                </Fragment>
              )
            })}
          </dl>

          <div className="flex flex-wrap gap-2">
            <p className="w-full text-sm capitalize lg:text-lg">Tags:</p>

            {work.tags?.map((tag) => (
              <span
                key={tag.id}
                className="rounded-lg bg-mizume-secondary px-2 py-1 text-xs text-white lg:px-3 lg:text-sm"
              >
                {tag.name}
              </span>
            ))}

          </div>
        </div>

        {/* Sinopsis */}
        <div className="min-w-0 lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:pl-6">
          <h2 className="mb-2 text-xl font-bold lg:text-2xl">Sinopsi</h2>
          <p
            lang="es"
            className="hyphens-auto break-words text-start text-sm leading-relaxed lg:text-base"
          >
            {work.sinopsi}
          </p>
        </div>
      </div>
    </div>
  )
}



export const BlogSection = ({ variant, works, work, posts, changeWork, users, content }: BlogSectionProps) => {
  const style = variant === "left" ? "border-mizume-fourthary" : "bg-mizume-fourthary border-mizume-primary"
  const component = variant === "left" ? <BlogCarousel works={works} changeWork={changeWork} /> : <BlogSectionContent posts={posts} work={work} users={users} content={content} />

  return (
    <div className={`min-w-0 lg:w-[50%] h-full border-4 rounded-2xl ${style}`}>
      {component}
    </div>
  );
}



const BlogCarousel = ({ works, changeWork }: BlogCarouselProps) => {
  const OPTIONS: EmblaOptionsType = { loop: true };
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


/** Helpers */
function ChangeKey(key: string, content: DATA_MAIN) {
  switch (key) {
    case "category":
      return content.work.category
    case "publish_date":
      return content.work.publish_date
    case "medium":
      return content.work.medium
    case "authors":
      return content.work.authors
    case "tags":
      return content.work.tags
    default:
      return "NOT FOUND"
  }
}