import { ROUTE } from "@/constants/routes"
import { BlogLayout } from "@/layouts/app"
import { BlogShow, BlogShowTrigger } from "@/layouts/app/blog-show"
import { Route, SharedData } from "@/types"
import { Paginated, Post, PostRecord, User, Work, WorkRecord } from "@/types/definitions"
import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react"
import { cn } from "@/lib/utils"
import { Article, PageProgress, PostsIndex, SIDEBAR_DATA, WorkShowHeader, WorkShowMain } from "@/core/desktop/work-show-components"
import { BlogShowSidebarContent } from "@/layouts/app/blog-show-components"
import useWorkShow from "@/hooks/custom/use-work-show"
import Coments from "@/core/coments/Coments"
import { useLangStore } from "@/store/lang-store"
import { usePage } from "@inertiajs/react"
import { DATA_ENTITIES } from "@/core/desktop/utils-components"
import PostIndex from "../posts"


export interface WorkShowProps {
  work: WorkRecord,
  content: string,
  paginated: Paginated<PostRecord>,
  users: User[]
}


function WorkShow({ work, content, paginated , users}: WorkShowProps) {


  
  const { mainRef } = useWorkShow();
  
  const lang = useLangStore((l) => l.lang)


  const WORK = DATA_ENTITIES[lang].work


  const { auth } = usePage<SharedData>().props

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

        <WorkShowHeader  work={work} lang={lang} WORK={WORK}>
          <div></div>
        </WorkShowHeader>

        <WorkShowMain mainRef={mainRef}>
         <PostsIndex paginated={paginated} lang={lang} />
        </WorkShowMain>
      </BlogShow>
    </BlogLayout>
  )
}

export default WorkShow