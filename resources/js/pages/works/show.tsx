import { ROUTE } from "@/constants/routes"
import { BlogLayout } from "@/layouts/app"
import { BlogShow, BlogShowTrigger } from "@/layouts/app/blog-show"
import { Route } from "@/types"
import { Work } from "@/types/definitions"
import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react"
import { cn } from "@/lib/utils"
import { Article, PageProgress, SIDEBAR_DATA, WorkShowHeader, WorkShowMain } from "@/core/desktop/work-show-components"
import { BlogShowSidebarContent } from "@/layouts/app/blog-show-components"
import useWorkShow from "@/hooks/custom/use-work-show"


export interface WorkShowProps {
  work: Work,
  content: string
}


function WorkShow({ work, content }: WorkShowProps) {


  const { mainRef } = useWorkShow();


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
        aside={<BlogShowSidebarContent data={SIDEBAR_DATA} />}

      >
        <PageProgress targetRef={mainRef} />

        <WorkShowHeader>
          <div></div>
        </WorkShowHeader>

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