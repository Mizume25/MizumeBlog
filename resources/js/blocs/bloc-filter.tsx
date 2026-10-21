/**
 * @fileoverview Bloque de diltro para cualquier vista indexada
 */
import { ReactNode } from "react"
import { Highlight } from '@/components/animate-ui/primitives/effects/highlight'
import {
    Button,
    ListBox,
    ListBoxItem,
    Popover,
    Select,
    SelectionIndicator,
    SelectValue,
} from '@animate-ui/react/primitives/react-aria';
import { label } from "motion/react-client";

interface BlocContent {
    title: string,
    children: React.ReactNode
}
const BlocContent = ({ children, title }: BlocContent) => {
    return (
        <>
            <h2 className="title">{title}</h2>
            <div className="mx-auto w-full max-w-7xl rounded-2xl bg-mizume-primary text-bg-primary p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 *:min-w-0">
                {children}
            </div>
        </>
    )
}

interface BlogTopUtilSideProps {
    children: ReactNode
    className?: string
}


const BlocTopLeft = ({ children, className = "" }: BlogTopUtilSideProps) => {
    return (
        <div className={`lg:col-span-5 flex flex-col gap-4 rounded-xl p-4 *:min-w-0 ${className}`}>
            {children}
        </div>
    )
}


const BlocTopRight = ({ children, className = "" }: BlogTopUtilSideProps) => {
    return (
        <div className={`lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 content-start gap-4 rounded-xl p-4 *:min-w-0 ${className}`}>
            {children}
        </div>
    )
}

type BlocSectionPropities = {
    sections?: unknown[] | object;
    value?: unknown
    onSection?: (v: unknown) => void;
    contentStyles?: string,
    itemStyles?: string,
} | {
    sections: unknown[] | object;
    value: unknown
    onSection: (v: unknown) => void;
    contentStyles: string,
    itemStyles: string,
}

type AllOrNone<T> = T | { [K in keyof T]?: never };

type BlocSectionProps = {
    sections: unknown[];
    labels: string[]
    value: unknown;
    onSection: (v: unknown) => void;
    title: string,
    titleStyle: string,
    containerStyles: string,
    rowStyles: string
    contentStyles: string;
    itemStyles: string;
}

const BlocSection = ({ value, sections, contentStyles, containerStyles, rowStyles, itemStyles, onSection, labels, title, titleStyle }: BlocSectionProps) => {



    return (

        <div className={`${containerStyles}`}> {/* bg-mizume-fourthary sm:col-span-2 flex flex-col gap-2 rounded-lg p-4 */}
            <h2 className={`${titleStyle}`}>{title}</h2>
            <div className={`${rowStyles}`}> {/*bg-mizume-secondary rounded-md p-2 flex flex-row*/}
                <Highlight
                    value={value as string}
                    onValueChange={(v) => v && onSection(v as string)}
                    className={`${contentStyles}`} //inset-0 rounded-lg bg-mizume-fourthary border-2 border-black
                >
                    {sections.map((v, i) => (
                        <button
                            key={i}
                            data-value={v}
                            className={`${itemStyles}`} //px-3 py-1 cursor-pointer whitespace-nowrap shrink-0 text-mizume-tertiary capitalize
                        >
                            {labels[v as any]}
                        </button>
                    ))}
                </Highlight>
            </div>
        </div>


    );
}


interface SelectProps {
    label: string,
    value: unknown,
    select: unknown[],
    data: object
    onSelect: (v :unknown) => void,

}

const BlocSelect = ({label , onSelect , value, select , data} : SelectProps) => {
    <Select aria-label={label} value={value as string} onChange={(key) => key && onSelect(key as string)}>
        <Button className="w-full text-left capitalize bg-mizume-secondary text-mizume-secondary-foreground p-2 rounded-xl cursor-pointer outline-none">
            <SelectValue />
        </Button>
        <Popover placement="bottom start" offset={4} className="w-(--trigger-width)">
            <ListBox className={`bg-mizume-secondary p-2 rounded-xl`} >
                {select.map((v) => {
                    const label = data[v];
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
}



const BlocLabel = ({ contentStyles, variant }: BlocLabelProps) => {



    return (
        <div className={`${contentStyles}`}>

        </div> //bg-mizume-fourthary flex flex-col gap-2 rounded-lg p-3
    )
}

type labelTypes = "search" | "select" | "tags" | "date"

interface BlocLabelProps {
    variant: labelTypes,
    contentStyles: string,
}



export const BlocFilter = () => {
    <BlocContent title="Opciones de Filtrado" >
        <BlocTopLeft>
            <BlocLabel>

            </BlocLabel>
            <BlocLabel>

            </BlocLabel>
        </BlocTopLeft>
        <BlocTopRight>

            <BlocLabel>

            </BlocLabel>
            <BlocLabel>

            </BlocLabel>
        </BlocTopRight>
    </BlocContent>
}

type BlocCheckBoxProps<T> = { checkBox: boolean, items: T[] } | { checkBox?: boolean, items?: T[] }
type BlocSectionsProps<T> = { sections: boolean, items: T[] } | { sections?: boolean, items?: T[] }
type BlocSelectProps<T> = { select: boolean, items: T[] } | { select?: boolean, items?: T[] }
type BlocSearchPorps = { search: boolean }

type BlogFilterProps<T> = {
    search?: BlocSearchPorps,
    checkBox?: BlocCheckBoxProps<T>,
    date?: boolean,
    sections?: BlocSectionsProps<T>
    select?: BlocSelectProps<T>,
}

export default BlocFilter