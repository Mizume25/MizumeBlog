import { PostsFilterHeader, PostsList } from "@/core/desktop/work-show-components"
import useWorkShow from "@/hooks/custom/use-work-show"
import WorkShowLayout from "@/layouts/app/work-show-layout"
import { useLangStore } from "@/store/lang-store"
import { DATA_WORK_SHOW } from "@/constants/work-show-constants"
import { WorkShowIndexProps } from "@/types/custom/work-show-types"
import { Head } from "@inertiajs/react"

/**
 * works/show/index: listado de posts del work (filtros + tarjetas).
 * Cada tarjeta navega a works.posts.show; el layout persistente se queda montado.
 */
function WorkShowIndex({ work, paginated, filters }: WorkShowIndexProps) {

  const lang = useLangStore((l) => l.lang)

  const DATA = DATA_WORK_SHOW[lang]

  const { search, setSearch, orderBy, setOrderBy, setOrderRevert, Posts, onFilter, onReset } =
    useWorkShow(filters, paginated.data, work.slug)

  return (
    <>
      <Head title={DATA.heads.index} />
      <PostsFilterHeader
        search={search}
        setSearch={setSearch}
        onFilter={onFilter}
        onReset={onReset}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        onRevert={() => setOrderRevert((r) => !r)}
        DATA={DATA}
      />
      <PostsList paginated={{ ...paginated, data: Posts }} lang={lang} DATA={DATA} work={work} />
    </>
  )
}

WorkShowIndex.layout = WorkShowLayout

export default WorkShowIndex
