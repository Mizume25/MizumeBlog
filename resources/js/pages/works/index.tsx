import { BlogLayout } from "@/layouts/app"
import { BlogTopUtil, BlogTopUtilLeft, BlogTopUtilRight, DATA_ENTITIES } from "@/core/desktop/utils-components"
import { WorkIndexMain } from "@/core/desktop/works-index-components"
import { Tag, WorkRecord } from "@/types/definitions"
import { useLangStore } from "@/store/lang-store"
import { FlipWork } from "@/components/flip-work"
import { Highlight } from '@/components/animate-ui/primitives/effects/highlight'
import { useWorkIndex } from "@/hooks/custom/use-workindex-hook"
import { MEDIUM_VALUES_TYPE, NAV_VALUES_TYPE } from "@/types/custom/work-index-types"
import { DATA_WORK_INDEX } from "@/constants/work-index-constants"


interface WorksIndexProps {
  works: WorkRecord[],
  tags: Tag[]
}

const TEXT = {
  es: { prev: 'Anterior', next: 'Siguiente', page: 'Página' },
  en: { prev: 'Previous', next: 'Next', page: 'Page' },
}


import {
  Button,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectionIndicator,
  SelectValue,
} from '@animate-ui/react/primitives/react-aria';
import { Terms } from "@/components/ui/terms"




function WorksIndex({ works, tags }: WorksIndexProps) {






  console.log(tags)

  const lang = useLangStore((l) => l.lang)


  const DATA = DATA_WORK_INDEX[lang]

  const WORK = DATA_ENTITIES[lang].work

  const { WORKS, medium, category, select, filterCategory, filterMedium, query, setQuery, selectTag, onTag } = useWorkIndex(works, DATA);




  return (
    <BlogLayout>
      <BlogTopUtil variant="authors">
        <BlogTopUtilLeft className="">
          <div className="bg-mizume-fourthary flex flex-col gap-2 rounded-lg p-3">
            <h2 className="title">{DATA.filter.tag}</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <Terms
                  key={t.id}
                  id={t.id}
                  value={t.name}
                  checked={selectTag.includes(t.id)}
                  onCheckedChange={onTag}
                  className="flex items-center gap-2 rounded-md px-2 py-1 bg-mizume-secondary text-mizume-tertiary cursor-pointer"
                />
              ))

              }
            </div>
          </div>
          <div className="bg-mizume-fourthary flex flex-col gap-2 rounded-lg p-3">
            <h2 className="title">{DATA.filter.publish_date}</h2>
            <div className="grid grid-cols-2 gap-2">
              <input type="date" className="bg-mizume-secondary text-mizume-tertiary p-2 rounded-lg" />
               <input type="date" className="bg-mizume-secondary text-mizume-tertiary p-2 rounded-lg"  />
            </div>
          </div>
        </BlogTopUtilLeft>

        <BlogTopUtilRight className="bg-mizume-primary/80">
          <div className="bg-mizume-fourthary sm:col-span-2 flex flex-col gap-2 rounded-lg p-3">
            <h2 className="title">{DATA.filter.category}</h2>
            <div className="bg-mizume-secondary rounded-md p-2 flex flex-row">
              <Highlight
                value={category}
                onValueChange={(v) => v && filterCategory(v as NAV_VALUES_TYPE)}
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
            <h2 className="title">{DATA.filter.medium}</h2>

            <Select aria-label={DATA.filter.medium} value={medium} onChange={(key) => key && filterMedium(key as MEDIUM_VALUES_TYPE)}>
              <Button className="w-full text-left capitalize bg-mizume-secondary text-mizume-secondary-foreground p-2 rounded-xl cursor-pointer outline-none">
                <SelectValue />
              </Button>
              <Popover placement="bottom start" offset={4} className="w-(--trigger-width)">
                <ListBox className={`bg-mizume-secondary p-2 rounded-xl`} >
                  {select.map((v) => {
                    const label = DATA.MEDIUM_LABELS[v];
                    return (
                      <ListBoxItem key={v} id={v} textValue={label} className={`capitalize outline-none  py-2 bg-mizume-secondary cursor-pointer  text-mizume-tertiary flex flex-row-reverse justify-center items-center data-focused:bg-mizume-fourthary`}>
                        {label}
                        <SelectionIndicator animation="pop">✓</SelectionIndicator>
                      </ListBoxItem>
                    )
                  })
                  }
                </ListBox>
              </Popover>
            </Select>

          </div>
          <div className="bg-mizume-fourthary flex flex-col gap-2 rounded-lg p-3">
            <h2 className="title">{DATA.filter.search}</h2>
            <div className="bg-mizume-primary rounded-md p-1">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar obras..."
                className="w-full capitalize bg-mizume-secondary text-mizume-secondary-foreground p-2 rounded-md cursor-pointer"
              />
            </div>
          </div>
        </BlogTopUtilRight>
      


      </BlogTopUtil>
      <WorkIndexMain>
        {WORKS.map((work) => (
          <FlipWork key={work.id} work={work} labels={WORK} />
        ))}
      </WorkIndexMain>
    </BlogLayout>
  )
}

export default WorksIndex