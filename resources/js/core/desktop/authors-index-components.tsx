

/**
 * @fileoverview Componentes de Authors
 */
import { AUTHOR_YEAR_MIN, DATA_AUTHOR_INDEX_TYPE } from '@/constants/authors-index-constants';
import { Highlight } from '@/components/animate-ui/primitives/effects/highlight';
import { CURRENT_YEAR } from '@/lib/utils';
import { AuthorOrder } from '@/types/custom/author-index-types';
import { Slider } from '@animate-ui/react/primitives/base-ui/slider';

interface AuthorsIndexProps {
    children: React.ReactNode
}


export const AuthorsMain = ({ children }: AuthorsIndexProps) => {
    return (
        <div className="mx-auto grid w-full max-w-8xl grid-cols-1 gap-8 rounded-2xl bg-mizume-primary p-5 sm:p-6 md:grid-cols-1 xl:grid-cols-3">
            {children}
        </div>
    )
}


interface SliderYearAuthorProps {
    title: string,
    value: number,
    onValueChange: (v: number) => void,
}


export function SliderYearAuthor( { title , value, onValueChange } : SliderYearAuthorProps) {
  return (
    <Slider.Root value={value} onValueChange={(v) => onValueChange(v)} min={AUTHOR_YEAR_MIN} max={CURRENT_YEAR} className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white font-semibold">{title}</span>
        <Slider.Value className="text-mizume-tertiary font-semibold tabular-nums" />
      </div>

      <Slider.Control className="flex w-full items-center h-6 touch-none select-none">
        <Slider.Track className="relative h-2 w-full rounded-full bg-mizume-secondary/30">
          <Slider.Indicator className="rounded-full bg-mizume-secondary" />
          <Slider.Thumb
            aria-label="Year"
            className="block h-5 w-5 rounded-full bg-mizume-tertiary border-2 border-mizume-secondary shadow cursor-pointer"
          />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  );
}

interface AuthorFilterSearchProps {
    search: string,
    setSearch: (v : string) => void,
    onFilter?: () => void 
}

export const AuthorFilterSearch = ({ search, setSearch, onFilter }: AuthorFilterSearchProps) => {
    return (
        <div className="bg-mizume-primary rounded-md p-1">
            <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter"}
                placeholder="Buscar obras..."
                className="w-full bg-mizume-secondary text-mizume-secondary-foreground p-2 rounded-md"
            />
        </div>
    )
}

interface AuthorFilterOrderByProps {
    orderBy: AuthorOrder,
    setOrderBy: (v: AuthorOrder) => void,
    DATA: DATA_AUTHOR_INDEX_TYPE,
}

export const AuthorFilterOrderBy = ({ orderBy, setOrderBy, DATA }: AuthorFilterOrderByProps) => {
    return (
        <div className="grid grid-cols-2 gap-2 bg-mizume-secondary rounded-lg ">
            <Highlight
                value={orderBy}
                onValueChange={(v) => setOrderBy(v as AuthorOrder)}
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
    )
}