import { ROUTE } from "@/constants/routes"
import { BlogLayout } from "@/layouts/app"
import { BlogShow, BlogShowTrigger } from "@/layouts/app/blog-show"
import { Route } from "@/types"
import { Work } from "@/types/definitions"
import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react"
import { cn } from "@/lib/utils"
import { SIDEBAR_DATA, WorkShowSideBarContent } from "@/core/desktop/work-show-components"




interface WorkShowProps {
  work: Work,
  content: string
}


interface ArticleProps {
  children?: React.ReactNode
  className?: string
}

interface PageProgressProps {
  /** Elemento cuyo recorrido se mide (p. ej. WorkShowMain) */
  targetRef: React.RefObject<HTMLElement | null>
}

/**
 * Barra de progreso de lectura del post.
 * Mide el scroll de la ventana relativo a `targetRef`:
 * 0% cuando el inicio del post llega arriba de la pantalla,
 * 100% cuando el final del post llega abajo de la pantalla.
 * Sticky: se queda pegada arriba y solo ocupa el ancho de la columna.
 */
export function PageProgress({ targetRef }: PageProgressProps) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 250, damping: 40, bounce: 0 })
  const reduce = useReducedMotion()

  return (
    <div className="sticky top-0 z-30 h-1 w-full overflow-hidden rounded-full bg-black/10">
      <motion.div
        className="h-full origin-left bg-mizume-fourthary"
        style={{ scaleX: reduce ? scrollYProgress : smooth }}
      />
    </div>
  )
}

/**
 * Artículo sin scroll propio: crece con su contenido y hace scroll la página.
 */
export function Article({ children, className }: ArticleProps) {
  return (
    <article className={cn("w-full max-w-none py-6", className)}>
      {children}
    </article>
  )
}


const WorkShowHeader = () => {
  return (
    <nav className="bg-white w-full h-25 rounded-xl flex items-center justify-end px-4" >
      <BlogShowTrigger />
    </nav>
  )
}




interface WorkShowMainProps {
  children: React.ReactNode
  mainRef?: React.Ref<HTMLDivElement>
}

const WorkShowMain = ({ children, mainRef }: WorkShowMainProps) => {
  return (
    <div ref={mainRef} className="relative bg-gray-400 w-full min-h-screen rounded-xl px-4 mt-4" >
      {children}
    </div>
  )
}

function WorkShow({ work, content }: WorkShowProps) {
  const mainRef = useRef<HTMLDivElement>(null)


  const routes: Route[] = [
    {
      label: "Home",
      url: ROUTE.main,
    },
    {
      label: "Works",
      url: ROUTE.work.index
    },
    {
      label: work.title,
      url: route("works.show", work.slug)
    }
  ]

  return (
    <BlogLayout routes={routes}>
      <BlogShow
        asideTitle={work.title}
        aside={<WorkShowSideBarContent data={SIDEBAR_DATA} />}
        
      >
        <PageProgress targetRef={mainRef} />

        <WorkShowHeader />

        <WorkShowMain mainRef={mainRef}>
          <Article>
            {/* contenido de la obra */}
          </Article>
        </WorkShowMain>


      </BlogShow>
    </BlogLayout>
  )
}

export default WorkShow