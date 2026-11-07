import { BlogLayout } from "@/layouts/app"
import { BlogTopUtil, BlogTopUtilLeft, BlogTopUtilRight, DATA_ENTITIES, FilterSearch } from "@/core/desktop/utils-components"
import { WorkFilterCategory, WorkFilterMedium, WorkFilterOrderBy, WorkFilterSearch, WorkFilterTags, WorkIndexMain } from "@/core/desktop/works-index-components"
import { Tag, WorkRecord } from "@/types/definitions"
import { useLangStore } from "@/store/lang-store"
import { FlipWork } from "@/components/flip-work"
import { useWorkIndex } from "@/hooks/custom/use-workindex-hook"
import { CategorySelect, MEDIUM_VALUES_TYPE, NAV_VALUES_TYPE, WorkFilters, WorkOrder } from "@/types/custom/work-index-types"
import { DATA_WORK_INDEX } from "@/constants/work-index-constants"
import { Paginated } from "@/types/definitions"
import { Button } from '@/components/ui/button';
import { Pagination } from "@/components/paginator"
import { FilterIcon, PictureInPicture2, RotateCcw, Tag as CategoryIcon, Tags, Search, Calendar, Notebook } from "lucide-react"
import RevertButton from "@/components/revert-buttono"
import { useEffect } from "react"
import { BlocContent, BlocLabel, BlocSection, BlocTopLeft, BlocTopRight } from "@/blocs/bloc-filter"
import { Route } from "@/types"
import { ROUTE } from "@/constants/routes"
import { PaginatedText } from "@/lib/utils"
import { SiNotebooklm } from "react-icons/si"
import { router } from "@inertiajs/react"
import { div } from "motion/react-client"
import { TurtleService } from "@/custom/services"


interface WorksIndexProps {
  paginated: Paginated<WorkRecord>,
  tags: Tag[],
  filters: WorkFilters
}



const routes: Route[] = [
  {
    label: "Home",
    url: ROUTE.main,
  },
  {
    label: "Works",
    url: ROUTE.work.index
  }
]




function WorksIndex({ paginated, tags, filters }: WorksIndexProps) {


  const lang = useLangStore((l) => l.lang)


  const DATA = DATA_WORK_INDEX[lang]

  const WORK = DATA_ENTITIES[lang].work

  const MEDIUM = DATA.MEDIUM_LABELS

  const { Works, medium, setMedium, mediumOptions, category, onCategory, onFilter,
    onReset, setSelectTags, selectTags, onTag, orderBy, setOrderBy, orderRevert,
    setOrderRevert, search, setSearch, selectWork, setSelectWork, onWork
  } = useWorkIndex(paginated.data, DATA, filters)

  


  return (
    <BlogLayout routes={routes}>
      <BlocContent title={DATA.main_title}>
        <BlocTopLeft>

          <BlocSection
            icon={Tags}
            title={DATA.filter.tag}
            titleStyles="title ms-2"
          >
            <WorkFilterTags
              DATA={DATA}
              onTag={onTag}
              selectTags={selectTags}
              tags={tags}

            />
          </BlocSection>

          <BlocLabel
            className="w-full lg:w-[50%]"
            icon={Calendar} title={DATA.filter.orderBy.title}
            titleStyles="title mx-2"
            sideTitle={<RevertButton onToggle={() => setOrderRevert((r) => !r)} className="bg-btn-info text-btn-info-foreground hover:bg-btn-info-foreground hover:text-btn-info" />}
          >
            <WorkFilterOrderBy
              DATA={DATA}
              orderBy={orderBy}
              setOrderBy={setOrderBy}

            />
          </BlocLabel>


        </BlocTopLeft>
        <BlocTopRight>



          <BlocSection
            icon={CategoryIcon}
            title={DATA.filter.category}
            titleStyles="title ms-2"
          >
            <WorkFilterCategory
              category={category}
              onCategory={onCategory}
              DATA={DATA}
            />

          </BlocSection>


          <BlocLabel
            title={DATA.filter.medium}
            icon={PictureInPicture2}
            titleStyles="title ms-2"
          >
            <WorkFilterMedium
              DATA={DATA}
              MEDIUM={MEDIUM}
              medium={medium}
              mediumOptions={mediumOptions}
              setMedium={setMedium}
            />
          </BlocLabel>

          <BlocLabel
            title={DATA.filter.search.label}
            icon={Search}
            titleStyles="title ms-2"
          >
            <FilterSearch
              search={search}
              onFilter={onFilter}
              setSearch={setSearch}
              content="bg-input-border rounded-md p-1"
              inputClass="w-full bg-input text-input-foreground placeholder:text-input-placeholder p-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-input-focus"
              placeholder={DATA.filter.search.placeholder}
            />

          </BlocLabel>

          <Button className="bg-btn-success text-btn-success-foreground cursor-pointer text-md py-6" onClick={onFilter}>
            <FilterIcon />
            {DATA.filter.apply}
          </Button>
          <Button variant={"ghost"} className="bg-btn-danger text-btn-danger-foreground  cursor-pointer text-md py-6" onClick={onReset}>
            <RotateCcw />
            {DATA.filter.reset}
          </Button>


          {selectWork !== null ? (
            <Button className="col-span-full w-full bg-btn-info text-btn-info-foreground cursor-pointer text-md py-6" onClick={() => router.get(route("works.show", selectWork.slug))}>
              <Notebook />
              {lang === "es" ? `Ver ${selectWork.title}` : `Show ${selectWork.title}`}
            </Button>
          ) : null}





        </BlocTopRight>
      </BlocContent>
      <WorkIndexMain>
        {Works.length !== 0 ? (
          Works.map((work) => (
            <FlipWork key={work.id} work={work} labels={WORK} keyClass="" labelsClass="" selectWork={selectWork} onWork={onWork} />
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center flex-row gap-5">
            <p>{DATA.err.withOutWorks}</p>
            <img src={TurtleService.onPath("dead")} alt={TurtleService.onName("dead")} className="h-30 w-30"/>
          </div>
        )}




        <div className="col-span-full">
          <Pagination
            prevUrl={paginated.prev_page_url}
            nextUrl={paginated.next_page_url}
            current={paginated.current_page}
            last={paginated.last_page}
            labels={PaginatedText[lang]}
            spanClass='text-sm font-bold text-mizume-secondary-foreground'
          />
        </div>

      </WorkIndexMain>
    </BlogLayout>
  )
}

export default WorksIndex