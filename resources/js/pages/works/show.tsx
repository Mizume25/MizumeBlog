import { ROUTE } from "@/constants/routes"
import { BlogLayout } from "@/layouts/app"
import { BlogShow, BlogShowTrigger } from "@/layouts/app/blog-show"
import { Route, SharedData } from "@/types"
import { Paginated, Post, PostRecord, User, Work, WorkRecord } from "@/types/definitions"
import { Article, BlocBack, PageProgress, PostIndexHeader, PostSidebar, PostsIndex, WorkShowAsideHeader, WorkShowHeader, WorkShowMain, WorkShowTabsBar } from "@/core/desktop/work-show-components"
import useWorkShow from "@/hooks/custom/use-work-show"
import { useLangStore } from "@/store/lang-store"
import { usePage } from "@inertiajs/react"
import { DATA_ENTITIES } from "@/core/desktop/utils-components"
import { PostUserFilter } from "@/types/custom/work-show-types"
import { DATA_WORK_SHOW } from "@/constants/work-show-constants"
import { useMobileNavigation } from "@/hooks/use-mobile-navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
import ApiToast from "@/components/api-toast"
import { TurtleService } from "@/custom/services"





export interface WorkShowProps {
  work: WorkRecord,
  paginated: Paginated<PostRecord>,
  users: User[],
  filters: PostUserFilter
}


function WorkShow({ work, paginated, users, filters }: WorkShowProps) {

  const lang = useLangStore((l) => l.lang)

  const { 
    search, 
    setSearch, 
    orderBy, 
    setOrderBy, 
    setOrderRevert, 
    Posts, onFilter, 
    onReset, 
    user, 
    setUser, 
    setTab, 
    tab, 
    postTab, 
    setPostTab, 
    onUser, 
    onBack, 
    content, 
    setContent, 
    body, 
    section, 
    setSection, 
    direction, 
    totalSections, 
    onIndex,
    toast 
  } = useWorkShow(filters, paginated.data, work.slug, users, lang);

  const isMobile = useIsMobile();


  const WORK = DATA_ENTITIES[lang].work

  
  const DATA = DATA_WORK_SHOW[lang]


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
      <ApiToast toast={toast}/>
      <BlogShow
        asideTitle={content === null ? "" : content.post.data.title}
        aside={<PostSidebar tab={tab} content={content} DATA={DATA} onIndex={onIndex} />}
        header={
          <WorkShowHeader work={work} lang={lang} WORK={WORK} tab={tab} />
        }
        subheader={
          <WorkShowTabsBar tab={tab} postTab={postTab} setPostTab={setPostTab} DATA={DATA} />
        }
        asideHeader={
          <WorkShowAsideHeader tab={tab}>
            <div className="flex flex-row justify-between items-center gap-4 ">
              <BlocBack text={DATA.postManage.back} onBack={onBack} />
            <img src={TurtleService.onPath("welcome")} alt={TurtleService.onName("welcome")} className="h-20 w-20" />
            </div>
          </WorkShowAsideHeader>
        }
      >
        {tab === "post" && totalSections > 0 && (
          <PageProgress section={section} total={totalSections} />
        )}

        <WorkShowMain>
          <PostIndexHeader
            users={users}
            user={user}
            onUser={onUser}
            tab={tab}
            lang={lang}
            search={search}
            setSearch={setSearch}
            onFilter={onFilter}
            onReset={onReset}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            onRevert={() => setOrderRevert((r) => !r)}
            onBack={onBack}
            DATA={DATA}
            content={content}
            totalSections={totalSections}
            section={section}
            setSection={setSection}
            isMobile={isMobile}
            postab={postTab}
          />
          <PostsIndex 
          paginated={{ ...paginated, data: Posts }} 
          lang={lang} onUser={onUser} 
          user={user} tab={tab} 
          DATA={DATA} 
          content={content} 
          body={body} 
          section={section} 
          direction={direction} 
          postTab={postTab}
          />
        </WorkShowMain>
      </BlogShow>
    </BlogLayout>
  )
}

export default WorkShow