/**
 * @fileoverview Componentes visuales de la mediateca.
 * Maqueta: el bloque de filtrado todavía no tiene estado ni acciones.
 * Usan container queries (@) porque también se mostrarán dentro de un dialog.
 */

import { BlocLabel } from "@/blocs/bloc-filter"
import { Button } from "@/components/ui/button"
import { DATA_MEDIA_TYPE, MEDIA_TYPE_VALUES, MediaTypeValue } from "@/constants/media-constants"
import { TurtleService } from "@/custom/services"
import { Media, Work } from "@/types/definitions"
import { BookOpen, ChevronDown, FilterIcon, Image as ImageIcon, Images, Palette, RotateCcw } from "lucide-react"
import {
    Button as AriaButton,
    ListBox,
    ListBoxItem,
    Popover,
    Select,
    SelectionIndicator,
    SelectValue,
} from '@animate-ui/react/primitives/react-aria';

interface MediaMainProps {
    children: React.ReactNode
}

export const MediaMain = ({ children }: MediaMainProps) => {
    return (
        <section className="@container mx-auto flex w-full max-w-8xl flex-col gap-4 rounded-2xl bg-mizume-primary p-4 sm:p-6">
            {children}
        </section>
    )
}


interface MediaDataProps {
    DATA: DATA_MEDIA_TYPE
}

/** Mismo marco para buscadores y selects: todos los controles del bloque miden igual */
const FIELD_FRAME = "bg-input-border rounded-md p-1"
const FIELD_CONTROL = "h-10 w-full bg-input text-input-foreground px-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-input-focus"

interface MediaFilterSearchProps {
    name: "search_name" | "search_artist",
    label: string,
    placeholder: string,
}

export const MediaFilterSearch = ({ name, label, placeholder }: MediaFilterSearchProps) => {
    return (
        <div className={FIELD_FRAME}>
            <input
                type="search"
                name={name}
                aria-label={label}
                placeholder={placeholder}
                autoComplete="off"
                className={`${FIELD_CONTROL} placeholder:text-input-placeholder`}
            />
        </div>
    )
}


type MediaWorkOption = Pick<Work, "id" | "title">

interface MediaFilterWorkProps extends MediaDataProps {
    works: MediaWorkOption[]
}

/** Selector de obra: muestra el título y su valor es el id */
export const MediaFilterWork = ({ DATA, works }: MediaFilterWorkProps) => {
    return (
        <Select aria-label={DATA.filter.work.label} name="work" placeholder={DATA.filter.work.placeholder} className={FIELD_FRAME}>
            <AriaButton className={`${FIELD_CONTROL} flex cursor-pointer items-center justify-between gap-2 text-left`}>
                <SelectValue className="truncate data-placeholder:text-input-placeholder" />
                <ChevronDown className="size-4 shrink-0" aria-hidden="true" />
            </AriaButton>
            <Popover placement="bottom start" offset={4} className="w-(--trigger-width)">
                <ListBox
                    items={works}
                    className="max-h-64 overflow-y-auto bg-popover text-popover-foreground p-2 rounded-xl"
                >
                    {(work) => (
                        <ListBoxItem id={work.id} textValue={work.title} className="outline-none rounded-md px-2 py-2 bg-popover cursor-pointer text-left text-item-foreground flex justify-between gap-2 items-center data-focused:bg-item-hover data-selected:text-item-active-foreground">
                            {work.title}
                            <SelectionIndicator animation="pop">✓</SelectionIndicator>
                        </ListBoxItem>
                    )}
                </ListBox>
            </Popover>
        </Select>
    )
}


export const MediaFilterType = ({ DATA }: MediaDataProps) => {
    return (
        <Select aria-label={DATA.filter.type} name="type" defaultValue={"all" satisfies MediaTypeValue} className={FIELD_FRAME}>
            <AriaButton className={`${FIELD_CONTROL} flex cursor-pointer items-center justify-between gap-2 text-left capitalize`}>
                <SelectValue className="truncate" />
                <ChevronDown className="size-4 shrink-0" aria-hidden="true" />
            </AriaButton>
            <Popover placement="bottom start" offset={4} className="w-(--trigger-width)">
                <ListBox className="bg-popover text-popover-foreground p-2 rounded-xl">
                    {MEDIA_TYPE_VALUES.map((key) => (
                        <ListBoxItem key={key} id={key} textValue={DATA.TYPE_LABELS[key]} className="capitalize outline-none py-2 bg-popover cursor-pointer text-item-foreground flex flex-row-reverse justify-center items-center data-focused:bg-item-hover data-selected:text-item-active-foreground">
                            {DATA.TYPE_LABELS[key]}
                            <SelectionIndicator animation="pop">✓</SelectionIndicator>
                        </ListBoxItem>
                    ))}
                </ListBox>
            </Popover>
        </Select>
    )
}


/**
 * Dos filas en ancho completo:
 *   1 → nombre de imagen · artista
 *   2 → obra · tipo · aplicar / resetear
 */
export const MediaFilters = ({ DATA, works }: MediaFilterWorkProps) => {
    return (
        <div className="grid grid-cols-1 items-stretch gap-4 @2xl:grid-cols-2 @5xl:grid-cols-6 @5xl:grid-rows-2">
            <BlocLabel className="min-w-0 @5xl:col-span-3" icon={ImageIcon} title={DATA.filter.search_name.label} titleStyles="title ms-2">
                <MediaFilterSearch name="search_name" label={DATA.filter.search_name.label} placeholder={DATA.filter.search_name.placeholder} />
            </BlocLabel>

            <BlocLabel className="min-w-0 @5xl:col-span-3" icon={Palette} title={DATA.filter.search_artist.label} titleStyles="title ms-2">
                <MediaFilterSearch name="search_artist" label={DATA.filter.search_artist.label} placeholder={DATA.filter.search_artist.placeholder} />
            </BlocLabel>

            <BlocLabel className="min-w-0 @5xl:col-span-2" icon={BookOpen} title={DATA.filter.work.label} titleStyles="title ms-2">
                <MediaFilterWork DATA={DATA} works={works} />
            </BlocLabel>

            <BlocLabel className="min-w-0 @5xl:col-span-2" icon={Images} title={DATA.filter.type} titleStyles="title ms-2">
                <MediaFilterType DATA={DATA} />
            </BlocLabel>

            <div className="grid grid-cols-2 gap-4 @2xl:col-span-2 @5xl:col-span-2">
                <Button type="button" className="h-full min-h-12 cursor-pointer bg-btn-success text-btn-success-foreground text-md">
                    <FilterIcon />
                    {DATA.filter.apply}
                </Button>
                <Button type="button" variant="ghost" className="h-full min-h-12 cursor-pointer bg-btn-danger text-btn-danger-foreground text-md">
                    <RotateCcw />
                    {DATA.filter.reset}
                </Button>
            </div>
        </div>
    )
}


interface MediaCardProps extends MediaDataProps {
    file: Media
}

export const MediaCard = ({ file, DATA }: MediaCardProps) => {
    const type = file.collection_name as MediaTypeValue

    return (
        <figure className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-item-border/40 bg-mizume-fourthary text-mizume-fourthary-foreground">
            <div className="relative aspect-[3/4] overflow-hidden bg-item">
                <img
                    src={file.preview_url || file.original_url}
                    alt={file.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute left-2 top-2 rounded-md bg-item-active px-2 py-0.5 text-xs font-semibold capitalize text-item-active-foreground">
                    {DATA.TYPE_LABELS[type] ?? file.collection_name}
                </span>
            </div>

            <figcaption className="flex min-w-0 flex-col gap-0.5 p-3">
                <span className="truncate text-sm font-semibold" title={file.name}>{file.name}</span>
                {file.credit && (
                    <span className="truncate text-xs text-md-muted">
                        {DATA.card.credit}{" "}
                        {file.credit.social_url ? (
                            <a href={file.credit.social_url} target="_blank" rel="noopener noreferrer" className="text-item-foreground underline underline-offset-2">
                                {file.credit.artist}
                            </a>
                        ) : file.credit.artist}
                    </span>
                )}
            </figcaption>
        </figure>
    )
}


interface MediaGridProps extends MediaDataProps {
    files: Media[]
}

export const MediaGrid = ({ files, DATA }: MediaGridProps) => {
    if (files.length === 0) {
        return (
            <div className="flex flex-row items-center justify-center gap-5 py-10">
                <p>{DATA.err.withOutMedia}</p>
                <img src={TurtleService.onPath("dead")} alt={TurtleService.onName("dead")} className="h-30 w-30" />
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 gap-3 @xl:grid-cols-3 @3xl:grid-cols-4 @6xl:grid-cols-6">
            {files.map((file) => <MediaCard key={file.id} file={file} DATA={DATA} />)}
        </div>
    )
}
