/**
 * Componentes de main.tsx
 *
 * La home muestra OBRAS destacadas por el admin (no posts): el carrusel (izquierda) elige una obra
 * y la ficha (derecha) la presenta y enlaza a su índice works/{slug}, donde se ven sus posts destacados.
 */
import React from 'react'
import { Link } from '@inertiajs/react'
import { MotionCarousel } from '@/components/animate-ui/components/community/motion-carousel';
import { EmblaOptionsType } from 'embla-carousel';
import { Author, WorkRecord } from '@/types/definitions';
import { ArrowRight, BookBookmark, NotebookTextIcon, UserCircle2, TurtleIcon } from 'lucide-react'
import { formatDate } from '@/lib/utils';
import { DATA_MAIN } from '@/constants/main-constants';
import { BlogItems, type DATA_ENTITIES_TYPE } from '@/core/desktop/utils-components';
import { Lang } from '@/store/lang-store';

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
  /** Obra seleccionada en el carrusel (null si la home no tiene obras) */
  work: WorkRecord | null,
  changeWork: (work: WorkRecord) => void
  ENTITIES: DATA_ENTITIES_TYPE,
  lang: Lang,
}

/** Interfaz de Blog props */
export interface BlogCarouselProps {
  works: WorkRecord[]
  changeWork: (work: WorkRecord) => void
}

/**
 * Props de la página main (HomeController).
 *
 * works: obras activadas por el admin para la home, en su orden (Work::onHome()).
 * Cada una con `tags` y `authors` cargados; la portada sale de `cover_url` (no hace falta `media`).
 */
export interface MainProps {
  works: WorkRecord[],
}

/**
 * Contenido hechos prop
 */
export interface BlogContentProps {
  children: React.ReactNode
}

/** Textos propios de la home */
const MAIN_TEXT = {
  es: {
    featured: "Ver sus destacados",
    unverified: "Ficha sin verificar",
    empty: "Todavía no hay obras destacadas.",
    emptyHint: "Explora todas las obras",
  },
  en: {
    featured: "See featured posts",
    unverified: "Unverified entry",
    empty: "There are no featured works yet.",
    emptyHint: "Browse all works",
  },
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


/** Nombre visible de un author (mismo criterio que Author::display_name en el backend) */
const authorName = (author: Author): string =>
  author.pseudonym || [author.name, author.last_name].filter(Boolean).join(" ")


interface BlogSectionWorkProps {
  work: WorkRecord,
  ENTITIES: DATA_ENTITIES_TYPE,
  lang: Lang,
}

/**
 * Ficha de la obra seleccionada: datos, tags, sinopsis y acceso a su índice de destacados.
 * Los campos se listan de forma explícita: los nuevos campos del modelo no aparecen solos.
 */
const BlogSectionWork = ({ work, ENTITIES, lang }: BlogSectionWorkProps) => {

  const TEXT = MAIN_TEXT[lang]
  const LABELS = ENTITIES.work

  const info: Record<string, unknown> = {
    category: work.category,
    medium: work.medium,
    publish_date: work.publish_date,
    authors: work.authors ?? [],
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 p-3 sm:p-4">

      {/* Cabecera: título, aviso de ficha pendiente y acceso al índice de la obra */}
      <div className="flex w-full flex-col items-center justify-between gap-3 rounded-2xl bg-mizume-primary p-3 sm:p-4 lg:flex-row lg:gap-4">
        <div className="flex min-w-0 flex-col items-center gap-1 lg:items-start">
          <h2 className="title min-w-0 text-center text-xl w-full lg:text-start">
            {work.title}
          </h2>
          {work.status === "pending" && (
            <span className="rounded-full border border-btn-warning/40 bg-btn-warning/10 px-2 py-0.5 text-[11px] italic text-btn-warning">
              {TEXT.unverified}
            </span>
          )}
        </div>

        <Link
          href={route('works.show', work.slug)}
          prefetch
          className="flex shrink-0 items-center gap-2 rounded-xl bg-mizume-tertiary px-4 py-2 text-sm font-semibold text-mizume-tertiary-foreground transition-transform duration-300 hover:scale-105"
        >
          {TEXT.featured}
          <ArrowRight size={16} />
        </Link>
      </div>


      <div className="flex w-full flex-1 flex-col gap-4 rounded-2xl bg-mizume-primary p-3 text-mizume-primary-foreground sm:p-4 lg:flex-row lg:gap-0 lg:p-6">

        {/* Datos + tags */}
        <div className="flex min-w-0 flex-col gap-3 border-b-2 border-mizume-primary-foreground/60 pb-4 lg:w-1/2 lg:justify-start lg:gap-5 lg:border-b-0 lg:border-r-2 lg:pb-0 lg:pr-6">
          <BlogItems
            data={info}
            formatKey={(key) => (LABELS as Record<string, string>)[key] ?? key}
            formatValue={(value, key) => {
              if (key === 'publish_date' && typeof value === 'string') return formatDate(value)
              if (key === 'authors' && Array.isArray(value)) {
                return (value as Author[]).map(authorName).filter(Boolean).join(', ') || '—'
              }
              return String(value ?? '—').replaceAll('_', ' ')
            }}
            keyClass="text-sm capitalize lg:text-lg"
            labelClass="justify-self-start break-words rounded-lg bg-tag px-2 py-1 text-sm capitalize text-tag-foreground lg:px-3 lg:text-base"
          />

          {work.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <p className="w-full text-sm capitalize lg:text-lg">{LABELS.tags}:</p>

              {work.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-lg bg-tag px-2 py-1 text-xs text-tag-foreground lg:px-3 lg:text-sm"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Sinopsis (llega ya en el idioma activo) */}
        <div className="min-w-0 lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:pl-6">
          <h2 className="mb-2 text-xl font-bold lg:text-2xl">{LABELS.sinopsi}</h2>
          <p
            lang={lang}
            className="hyphens-auto break-words text-start text-sm leading-relaxed lg:text-base"
          >
            {work.sinopsi}
          </p>
        </div>
      </div>
    </div>
  )
}


/** Sin obras en la home: el admin aún no ha activado ninguna */
const BlogSectionEmpty = ({ lang }: { lang: Lang }) => {
  const TEXT = MAIN_TEXT[lang]

  return (
    <div className="flex h-full min-h-60 w-full flex-col items-center justify-center gap-3 p-6 text-center">
      <BookBookmark size={48} className="text-mizume-tertiary" />
      <p className="text-sm italic">{TEXT.empty}</p>
      <Link
        href={route('works.index')}
        className="flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
      >
        {TEXT.emptyHint}
        <ArrowRight size={14} />
      </Link>
    </div>
  )
}


export const BlogSection = ({ variant, works, work, changeWork, ENTITIES, lang }: BlogSectionProps) => {
  const style = variant === "left" ? "border-mizume-fourthary" : "bg-mizume-fourthary border-mizume-primary"

  const component = !work
    ? <BlogSectionEmpty lang={lang} />
    : variant === "left"
      ? <BlogCarousel works={works} changeWork={changeWork} />
      : <BlogSectionWork work={work} ENTITIES={ENTITIES} lang={lang} />

  return (
    <div className={`min-w-0 lg:w-[50%] h-full border-4 rounded-2xl ${style}`}>
      {component}
    </div>
  );
}



const BlogCarousel = ({ works, changeWork }: BlogCarouselProps) => {
  /**
   * containScroll: false → un snap por slide aunque Embla desactive el loop por falta de slides
   * (selectedScrollSnap() se usa como índice de works). align center encaja con el scale del activo.
   */
  const OPTIONS: EmblaOptionsType = { loop: true, align: 'center', containScroll: false };
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
