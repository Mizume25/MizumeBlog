import { BlogLayout } from "@/layouts/app"
import { BlogTopUtil, BlogTopUtilLeft, BlogTopUtilRight, DATA_ENTITIES } from "@/core/desktop/utils-components"
import { WorkIndexMain } from "@/core/desktop/works-index-components"
import { Tag, WorkRecord } from "@/types/definitions"
import { useLangStore } from "@/store/lang-store"
import { FlipWork } from "@/components/flip-work"
import { Highlight } from '@/components/animate-ui/primitives/effects/highlight'
import { useWorkIndex } from "@/hooks/custom/use-workindex-hook"
import { CategorySelect, MEDIUM_VALUES_TYPE, NAV_VALUES_TYPE, WorkFilters, WorkOrder } from "@/types/custom/work-index-types"
import { DATA_WORK_INDEX } from "@/constants/work-index-constants"
import { Paginated } from "@/types/definitions"


interface WorksIndexProps {
  paginated: Paginated<WorkRecord>,
  tags: Tag[],
  filters: WorkFilters
}

const TEXT = {
  es: { prev: 'Anterior', next: 'Siguiente', page: 'Página' },
  en: { prev: 'Previous', next: 'Next', page: 'Page' },
}

import { Button } from '@/components/ui/button';
import {
  Button as AriaButton,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectionIndicator,
  SelectValue,
} from '@animate-ui/react/primitives/react-aria';
import { Terms } from "@/components/ui/terms"
import { PaginatedText, Pagination } from "@/components/paginator"
import { FilterIcon, PictureInPicture2, RotateCcw, Tag as CategoryIcon, Tags, Search, Calendar } from "lucide-react"
import RevertButton from "@/components/revert-buttono"
import { useEffect } from "react"




function WorksIndex({ paginated, tags, filters }: WorksIndexProps) {


  const lang = useLangStore((l) => l.lang)


  const DATA = DATA_WORK_INDEX[lang]

  const WORK = DATA_ENTITIES[lang].work

  const MEDIUM = DATA.MEDIUM_LABELS

  const { Works, medium, setMedium, mediumOptions, category, onCategory, onFilter, onReset, setSelectTags, selectTags, onTag, orderBy, setOrderBy, orderRevert, setOrderRevert, search, setSearch } = useWorkIndex(paginated.data, DATA, filters)

  return (
    <BlogLayout>
      <BlogTopUtil variant="authors">
        <BlogTopUtilLeft className="">
          <div className="bg-mizume-fourthary flex flex-col gap-2 rounded-lg p-3">


            <div className="flex flex-row items-center justify-start">
              <Tags className="title" />
              <h2 className="title ms-2">{DATA.filter.tag}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => {
                if (selectTags.includes(t.id)) return;
                return (
                  <Terms
                    key={t.id}
                    id={t.id}
                    value={t.name}

                    onCheckedChange={onTag}
                    className="flex items-center gap-2 rounded-md px-2 py-1 bg-mizume-secondary text-mizume-tertiary cursor-pointer"
                  />
                )
              }
              )

              }

              <div className="bg-mizume-tertiary w-full h-1 rounded-xl mx-10 mt-4" ></div>
              <div className="flex flex-row items-center justify-start">
                <Tags className="title" />
                <h2 className="title ms-2">{DATA.filter.selectTag}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => {
                  if (!selectTags.includes(t.id)) return;
                  return (
                    <Terms
                      key={t.id}
                      id={t.id}
                      value={t.name}
                      checked={selectTags.includes(t.id)}
                      onCheckedChange={onTag}
                      className="flex items-center gap-2 rounded-md px-2 py-1 bg-mizume-secondary text-mizume-tertiary cursor-pointer"
                    />
                  )
                }
                )

                }
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between items-center">
            <div className="bg-mizume-fourthary flex flex-col gap-2 rounded-lg p-3 w-full lg:w-[50%]">

              <div className="flex flex-row items-center justify-star rounded-xl">
                <Calendar className="title" />
                <h2 className="title mx-4">{DATA.filter.orderBy.title}</h2>
                <RevertButton
                  onToggle={() => setOrderRevert((r) => !r)}
                  className="bg-btn-info text-btn-info-foreground hover:bg-btn-info-foreground hover:text-btn-info"

                />
              </div>
              <div className="grid grid-cols-2 gap-2 bg-mizume-secondary rounded-lg ">
                <Highlight
                  value={orderBy}
                  onValueChange={(v) => setOrderBy(v as WorkOrder)}
                  className="inset-0 rounded-lg bg-mizume-fourthary border-2 border-black"
                >
                  {DATA.filter.orderBy.types.map((c) => (
                    <button
                      key={c.type}
                      aria-label={c.label}
                      data-value={c.type}
                      className="px-3 py-1  whitespace-nowrap shrink-0 text-mizume-tertiary capitalize cursor-pointer"
                    >
                      <c.icon />

                    </button>
                  ))}
                </Highlight>
              </div>
            </div>

          </div>



        </BlogTopUtilLeft>

        <BlogTopUtilRight className="bg-mizume-primary/80">
          <div className="bg-mizume-fourthary sm:col-span-2 flex flex-col gap-2 rounded-lg p-3">

            <div className="flex flex-row items-center justify-start">
              <CategoryIcon className="title" />
              <h2 className="title ms-2">{DATA.filter.category}</h2>
            </div>
            <div className="bg-mizume-secondary rounded-md p-2 flex flex-row">
              <Highlight
                value={category}
                onValueChange={(v) => onCategory(v as CategorySelect)}
                className="inset-0 rounded-lg bg-mizume-fourthary border-2 border-black"
              >
                {DATA.NAV_VALUES.map((c) => (
                  <button
                    key={c}
                    data-value={c}
                    className="px-3 py-1 cursor-pointer whitespace-nowrap shrink-0 text-mizume-tertiary capitalize"
                  >
                    {DATA.NAV_LABELS[c]}
                  </button>
                ))}
              </Highlight>
            </div>
          </div>
          <div className="bg-mizume-fourthary flex flex-col gap-2 rounded-lg p-3">

            <div className="flex flex-row items-center justify-start">
              <PictureInPicture2 className="title" />
              <h2 className="title ms-2">{DATA.filter.medium}</h2>
            </div>

            <Select
              aria-label={DATA.filter.medium}
              value={medium}
              onChange={(key) => key && setMedium(key as MEDIUM_VALUES_TYPE)}
            >
              <AriaButton className="w-full text-left capitalize bg-mizume-secondary text-mizume-secondary-foreground p-2 rounded-xl cursor-pointer outline-none">
                <SelectValue />
              </AriaButton>
              <Popover placement="bottom start" offset={4} className="w-(--trigger-width)">
                <ListBox className={`bg-mizume-secondary p-2 rounded-xl`} >
                  {mediumOptions.map((key) => (
                    <ListBoxItem key={key} id={key} textValue={MEDIUM[key]} className={`capitalize outline-none  py-2 bg-mizume-secondary cursor-pointer  text-mizume-tertiary flex flex-row-reverse justify-center items-center data-focused:bg-mizume-fourthary`}>
                      {MEDIUM[key]}
                      <SelectionIndicator animation="pop">✓</SelectionIndicator>
                    </ListBoxItem>
                  ))}
                </ListBox>
              </Popover>
            </Select>

          </div>
          <div className="bg-mizume-fourthary flex flex-col gap-2 rounded-lg p-3">

            <div className="flex flex-row items-center justify-start">
              <Search className="title" />
              <h2 className="title ms-2">{DATA.filter.search}</h2>
            </div>
            <div className="bg-mizume-primary rounded-md p-1">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onFilter()}
                placeholder="Buscar obras..."
                className="w-full bg-mizume-secondary text-mizume-secondary-foreground p-2 rounded-md"
              />
            </div>
          </div>

          <Button variant={"default"} className="bg-btn-success cursor-pointer text-md py-6" onClick={onFilter}>
            <FilterIcon />
            {DATA.filter.apply}
          </Button>
          <Button variant={"ghost"} className="bg-btn-danger cursor-pointer text-md py-6" onClick={onReset}>
            <RotateCcw />
            {DATA.filter.reset}
          </Button>



        </BlogTopUtilRight>



      </BlogTopUtil>
      <WorkIndexMain>
        {Works.map((work) => (
          <FlipWork key={work.id} work={work} labels={WORK} />
        ))}

        <div className="col-span-full">
          <Pagination
            prevUrl={paginated.prev_page_url}
            nextUrl={paginated.next_page_url}
            current={paginated.current_page}
            last={paginated.last_page}
            labels={PaginatedText[lang]}
          />
        </div>

      </WorkIndexMain>
    </BlogLayout>
  )
}

export default WorksIndex