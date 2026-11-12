import { BlocSectionPage } from "@/blocs/bloc-manage-info"
import { PageProgress, PostSections, PostSidebar } from "@/core/desktop/work-show-components"
import usePostSections from "@/hooks/custom/use-post-sections"
import WorkShowLayout, { useWorkShowSlots } from "@/layouts/app/work-show-layout"
import { useLangStore } from "@/store/lang-store"
import { DATA_WORK_SHOW } from "@/constants/work-show-constants"
import { WorkShowPostProps } from "@/types/custom/work-show-types"
import { Head } from "@inertiajs/react"

/**
 * works/show/post: lectura del post por secciones.
 * Aporta al layout el índice (aside), la barra de progreso y el selector de secciones.
 */
function WorkShowPost({ post, build }: WorkShowPostProps) {

  const lang = useLangStore((l) => l.lang)

  const DATA = DATA_WORK_SHOW[lang]

  const { section, setSection, direction, onIndex, totalSections, body } = usePostSections(build)

  

  useWorkShowSlots({
    aside: <PostSidebar DATA={DATA} index={build.index} onIndex={onIndex} />,
    top: totalSections > 0 && <PageProgress section={section} total={totalSections} />,
    headerExtra: (
      <BlocSectionPage
        variant='numbers'
        className="flex min-w-0 flex-1 h-20 items-center justify-center rounded-2xl bg-mizume-fourthary py-2 px-4 @2xl:shrink-0 @2xl:min-w-56"
        lang={lang}
        key={post.id}
        sections={{ min: 1, max: totalSections }}
        value={section + 1}
        onChange={(n) => setSection(n - 1)}
      />
    ),
  }, [build, section, lang])

  return (
    <>
      <Head title={post.title} />
      <PostSections postId={post.id} body={body} section={section} direction={direction} />
    </>
  )
}

WorkShowPost.layout = WorkShowLayout

export default WorkShowPost
