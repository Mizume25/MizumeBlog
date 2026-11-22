

/**
 * @fileoverview Componentes de Authors
 */
import { AUTHOR_YEAR_MIN, DATA_AUTHOR_INDEX_TYPE } from '@/constants/authors-index-constants';
import { CURRENT_YEAR } from '@/lib/utils';
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
        <span className="text-mizume-fourthary-foreground font-semibold">{title}</span>
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
        <div className="bg-input-border rounded-md p-1">
            <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter"}
                placeholder="Buscar obras..."
                className="w-full bg-input text-input-foreground placeholder:text-input-placeholder p-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-input-focus"
            />
        </div>
    )
}
