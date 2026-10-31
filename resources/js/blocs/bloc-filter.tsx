/**
 * @fileoverview Bloque de diltro para cualquier vista indexada
 */
import { ReactNode } from "react"
import { Highlight } from '@/components/animate-ui/primitives/effects/highlight'
import { LucideIcon } from "lucide-react"

interface BlocContentProps {
    children: React.ReactNode,
    title: string
}

export const BlocContent = ({ children , title} : BlocContentProps) => {
    return (
        <>
            <h2 className="title">{title}</h2>
            <div className="mx-auto w-full max-w-7xl rounded-2xl bg-mizume-primary text-bg-primary p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 *:min-w-0">
                {children}
            </div>
        </>
    )
}

export const BlocMain = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="col-span-1 lg:col-span-12 flex flex-col gap-4 rounded-xl p-4 *:min-w-0">
            {children}
        </div>
    )
}


export const BlocTopLeft = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className={`lg:col-span-5 flex flex-col gap-4 rounded-xl p-4 *:min-w-0`}>
            {children}
        </div>
    )
}


export const BlocTopRight = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className={`lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 content-start gap-4 rounded-xl p-4 *:min-w-0`}>
            {children}
        </div>
    )
}


interface BlocSectionProps {
    title: string,
    titleStyles: string,
    children: React.ReactNode,
    icon: LucideIcon
}

export const BlocSection = ({ title, titleStyles, children, icon: Icon }: BlocSectionProps) => {
    return (

        <div className={`bg-mizume-fourthary sm:col-span-2 flex flex-col gap-2 rounded-lg p-4 `}>
            <div className="flex flex-row items-center justify-start">
                <Icon className="size-5 shrink-0 text-white" aria-hidden="true" />
                <h2 className={`${titleStyles}`}>{title}</h2>
            </div>
            <div className={`bg-mizume-secondary rounded-md p-2 flex flex-row`}>
                {children}
            </div>
        </div>


    );
}

interface BlocLabelProps {
    title: string,
    titleStyles?: string,
    children: React.ReactNode,
    icon: LucideIcon,
    className?: string,
    sideTitle?: React.ReactNode,
}

export const BlocLabel = ({ children, icon: Icon, title, titleStyles, className, sideTitle }: BlocLabelProps) => {



    return (
        <div className={`bg-mizume-fourthary flex flex-col gap-2 rounded-lg p-3 ${className}`}>
            <div className="flex flex-row items-center justify-start">
                <Icon className="size-5 shrink-0 text-white" aria-hidden="true" />
                <h2 className={`${titleStyles}`}>{title}</h2>
                {sideTitle}
            </div>
            {children}
        </div>
    )
}






