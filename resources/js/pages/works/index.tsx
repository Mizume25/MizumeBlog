import { BlogLayout } from "@/layouts/app"
import { BlogCardWork, BlogTopUtil, DATA_ENTITIES } from "@/core/desktop/utils-components"
import { WorkIndexMain } from "@/core/desktop/works-index-components"
import { Paginated, WorkRecord } from "@/types/definitions"
import { useLangStore } from "@/store/lang-store"
import { FlipWork } from "@/components/flip-work"
import { Pagination } from "@/components/paginator"

interface WorksIndexProps {
  works: Paginated<WorkRecord>
}

const TEXT = {
    es: { prev: 'Anterior', next: 'Siguiente', page: 'Página' },
    en: { prev: 'Previous', next: 'Next', page: 'Page' },
}

function WorksIndex({ works }: WorksIndexProps) {


 

  const lang = useLangStore((l) => l.lang)

  const WORK = DATA_ENTITIES[lang].work
  const PAGINATE = TEXT[lang]


  return (
    <BlogLayout>
      <BlogTopUtil>

      </BlogTopUtil>
      <WorkIndexMain>
        {works.data.map((work) => (
          <FlipWork key={work.id} work={work} labels={WORK} />
        ))}
        <div className="col-span-full">
        <Pagination
            prevUrl={works.prev_page_url}
            nextUrl={works.next_page_url}
            current={works.current_page}
            last={works.last_page}
            labels={PAGINATE}
        />
    </div>
      </WorkIndexMain>
    </BlogLayout>
  )
}

export default WorksIndex