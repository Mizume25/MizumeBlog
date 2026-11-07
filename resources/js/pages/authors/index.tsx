import { BlocContent, BlocLabel, BlocMain } from "@/blocs/bloc-filter"
import { Button } from "@/components/animate-ui/components/buttons/button"
import AuthorCard from "@/components/card-authors"
import { Pagination } from "@/components/paginator"
import RevertButton from "@/components/revert-buttono"
import { DATA_AUTHOR_INDEX } from "@/constants/authors-index-constants"
import { ROUTE } from "@/constants/routes"
import { AuthorFilterOrderBy, AuthorFilterSearch, AuthorsMain, SliderYearAuthor } from "@/core/desktop/authors-index-components"
import { PostIndexMain } from "@/core/desktop/post-index-components"
import { DATA_ENTITIES, FilterSearch } from "@/core/desktop/utils-components"
import { useAuthorsIndex } from "@/hooks/custom/use-authorsindex-hook"
import { BlogLayout } from "@/layouts/app"
import { PaginatedText } from "@/lib/utils"
import { useLangStore } from "@/store/lang-store"
import { Route } from "@/types"
import { AuthorFilter } from "@/types/custom/work-index-types"
import { Author, Paginated } from "@/types/definitions"
import { Calendar, FilterIcon, RotateCcw, Search } from "lucide-react"

const routes: Route[] = [
  {
    label: "Home",
    url: ROUTE.main,
  },
  {
    label: "Authors",
    url: ROUTE.authors.index
  }
]

interface AuthorsIndexProps {
  paginated: Paginated<Author>,
  filters: AuthorFilter
}



function AuthorsIndex({ paginated, filters }: AuthorsIndexProps) {



  const lang = useLangStore((l) => l.lang)
  const AUTHOR = DATA_ENTITIES[lang].author
  const DATA = DATA_AUTHOR_INDEX[lang]

  const { year, setYear, search, setSearch, orderBy, setOrderBy, setOrderRevert, onFilter, onReset, Authors } = useAuthorsIndex(paginated.data, DATA, filters);

  return (
    <BlogLayout routes={routes}>
      <BlocContent title={DATA.main_title}>
        <BlocMain>
          <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] items-stretch gap-4">
            {/* 1. Slider */}
            <div className="min-w-0">
              <BlocLabel
                title={DATA.filter.slider.title}
                icon={Calendar}
                titleStyles="title ms-2"
              >
                <SliderYearAuthor title={DATA.filter.slider.label} value={year} onValueChange={setYear} />
              </BlocLabel>
            </div>

            {/* 2. Búsqueda */}
            <div className="min-w-0">
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
            </div>

            {/* 3. Acciones */}
            <div className="flex flex-col justify-center gap-2 lg:w-40">
              <Button className="bg-btn-success text-btn-success-foreground cursor-pointer text-md py-6" onClick={onFilter}>
                <FilterIcon />
                {DATA.filter.apply}
              </Button>
              <Button variant={"ghost"} className="bg-btn-danger text-btn-danger-foreground  cursor-pointer text-md py-6" onClick={onReset}>
                <RotateCcw />
                {DATA.filter.reset}
              </Button>

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <AuthorFilterOrderBy
                    DATA={DATA}
                    orderBy={orderBy}
                    setOrderBy={setOrderBy}
                  />
                </div>
                <RevertButton
                  onToggle={() => setOrderRevert((r) => !r)}
                  className="bg-btn-info text-btn-info-foreground hover:bg-btn-info-foreground hover:text-btn-info"
                />
              </div>
             
            </div>
          </div>


        </BlocMain>
      </BlocContent>
      <AuthorsMain>

        {Authors.map((a) => (
          <AuthorCard
            key={a.id}
            author={a}
            avatarUrl={a.profile_url}
            labels={AUTHOR}
          />
        ))

        }

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

      </AuthorsMain>
    </BlogLayout>
  )
}

export default AuthorsIndex