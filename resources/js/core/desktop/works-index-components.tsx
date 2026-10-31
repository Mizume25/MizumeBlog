import { Terms } from "@/components/ui/terms"
import { DATA_WORK_INDEX_TYPE } from "@/constants/work-index-constants"
import { Tag } from "@/types/definitions"
import { Tags } from "lucide-react"
import { Highlight } from '@/components/animate-ui/primitives/effects/highlight'
import { CategorySelect, MEDIUM_VALUES_TYPE, WorkOrder } from "@/types/custom/work-index-types"
import {
    Button as AriaButton,
    ListBox,
    ListBoxItem,
    Popover,
    Select,
    SelectionIndicator,
    SelectValue,
} from '@animate-ui/react/primitives/react-aria';
interface WorkIndexMainProps {
    children: React.ReactNode
}
export const WorkIndexMain = ({ children }: WorkIndexMainProps) => {
    return (
        <div className="mx-auto grid w-full max-w-8xl grid-cols-1 gap-8 rounded-2xl bg-mizume-primary p-5 sm:p-6 md:grid-cols-1 xl:grid-cols-2">
            {children}
        </div>
    )
}


interface WorkFilterTags {
    tags: Tag[],
    selectTags: number[],
    onTag: (id: number, checked: boolean) => void,
    DATA: DATA_WORK_INDEX_TYPE,
}

export const WorkFilterTags = ({ DATA, onTag, selectTags, tags }: WorkFilterTags) => {
    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((t) => {
                if (selectTags.includes(t.id)) return;
                return (
                    <Terms
                        key={t.id}
                        id={t.id}
                        value={t.name}

                        onCheckedChange={onTag}
                        className="flex items-center gap-2 rounded-md px-2 py-1 bg-mizume-tertiary text-mizume-tertiary-foreground cursor-pointer"
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
                            className="flex items-center gap-2 rounded-md px-2 py-1 bg-mizume-tertiary text-mizume-tertiary-foreground cursor-pointer"
                        />
                    )
                }
                )

                }
            </div>
        </div>
    )
}

interface WorkFilterOrderByProps {
    orderBy: WorkOrder,
    setOrderBy: (v: WorkOrder) => void,
    DATA: DATA_WORK_INDEX_TYPE,

}

export const WorkFilterOrderBy = ({ orderBy, setOrderBy, DATA }: WorkFilterOrderByProps) => {
    return (
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
    )
}

interface WorkFilterCategoryProps {
    category: CategorySelect,
    onCategory: (v: CategorySelect) => void,
    DATA: DATA_WORK_INDEX_TYPE,
}

export const WorkFilterCategory = ({ category, onCategory, DATA }: WorkFilterCategoryProps) => {
    return (
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
    )
}


interface WorkFilterMediumProps {
    medium: MEDIUM_VALUES_TYPE,
    DATA: DATA_WORK_INDEX_TYPE,
    mediumOptions: MEDIUM_VALUES_TYPE[],
    MEDIUM: Record<MEDIUM_VALUES_TYPE, string>,
    setMedium: (v: MEDIUM_VALUES_TYPE) => void,
}

export const WorkFilterMedium = ({ DATA, MEDIUM, medium, mediumOptions, setMedium }: WorkFilterMediumProps) => {
    return (
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
    )
}


interface WorkFilterSearchProps {
    search: string,
    setSearch: (v: string) => void,
    onFilter: () => void,
    placeholder: string
}


export const WorkFilterSearch = ({ search, setSearch, onFilter , placeholder }: WorkFilterSearchProps) => {
    return (
        <div className="bg-mizume-primary rounded-md p-1">
            <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onFilter()}
                placeholder={placeholder}
                className="w-full bg-mizume-secondary text-mizume-secondary-foreground p-2 rounded-md"
            />
        </div>
    )
}