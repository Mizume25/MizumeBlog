import { Button } from "@/components/animate-ui/components/buttons/button";
import { cn } from "@/lib/utils";
import { Lang } from "@/store/lang-store";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button as AriaButton, Select } from 'react-aria-components';
import {
    ListBox,
    ListBoxItem,
    Popover,
    SelectionIndicator,
    SelectValue,
} from '@animate-ui/react/primitives/react-aria';
import { User } from "@/types/definitions";




export type SectionsTypes = {
    max: number,
    min: number,
}

interface BlocSectionPageProps {
    className: string,
    lang: Lang,
    sections: SectionsTypes
}

export const BlocSectionPage = ({ className, lang, sections }: BlocSectionPageProps) => {


    const [section, setSection] = useState(1);

    const [prev, setPrev] = useState(false)

    const [next, setNext] = useState(false)





    useEffect(() => {

        if (section < sections.max && section > sections.min) {
            setNext(false)
            setPrev(false)
        }

        if (section >= sections.max) setNext(true)

        if (section <= sections.min) setPrev(true)

    }, [section])

    const title = lang === 'es' ? "Seccion" : "Section"


    return (
        <div className={`${className}`}>
            <div className="w-full h-full bg-mizume-primary flex flex-row justify-between items-center rounded-xl">

                <div className="p-2">
                    <Button variant={"default"} className="bg-mizume-fourthary hover:bg-mizume-secondary hover:text-mizume-secondary-foreground" onClick={() => setSection((s) => s - 1)} disabled={prev}>
                        <ArrowLeft />
                    </Button>
                </div>

                <div className="p-2">
                    <span className="title">
                        {title} {section} / {sections.max}
                    </span>
                </div>


                <div className="p-2">
                    <Button variant={"default"} className="bg-mizume-fourthary hover:bg-mizume-secondary hover:text-mizume-secondary-foreground " onClick={() => setSection((s) => s + 1)} disabled={next}>
                        <ArrowRight />
                    </Button>
                </div>

            </div>
        </div>
    )
}






interface BlocTabsProps<T extends string> {
    tabs: readonly T[];
    className?: string;
    onChange?: (tab: T) => void;
    onLabel: (v: string) => void,
}

/**
 * Pestañas genéricas: reparten el ancho entre N labels (flex-1)
 * y un indicador que se desliza hacia la pestaña activa.
 */
export const BlocTabs = <T extends string>({ tabs, className, onChange, onLabel }: BlocTabsProps<T>) => {
    const [activeTab, setActiveTab] = useState<T>(tabs[0]);
    const activeIndex = tabs.indexOf(activeTab);

    const select = (t: T) => {
        setActiveTab(t);
        onChange?.(t);
        // Se notifica en el clic, no durante el render (evita setState del padre mientras se pinta)
        onLabel(t);
    };

    return (
        <div className={className}>
            <div className="relative flex h-full w-full flex-row">
                {tabs.map((t) => (
                    <div
                        key={t}
                        onClick={() => select(t)}
                        className={cn(
                            'flex-1 text-mizume-tertiary flex flex-row items-center justify-center cursor-pointer transition-opacity duration-300 ease-out',
                            activeTab === t ? 'opacity-100' : 'opacity-60 hover:opacity-90',
                        )}
                    >
                        {t}
                    </div>
                ))}

                {/* Ancho y desplazamiento dinámicos: van en style porque Tailwind no genera clases en runtime */}
                <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-mizume-tertiary transition-transform duration-300 ease-out motion-reduce:transition-none"
                    style={{
                        width: `${100 / tabs.length}%`,
                        transform: `translateX(${activeIndex * 100}%)`,
                    }}
                />
            </div>
        </div>
    );
};



function BlocManageInfo() {
    return (
        <div className="grid min-h-45 w-full grid-cols-1 grid-rows-2 gap-4 rounded-xl bg-mizume-secondary/80 p-4 max-md:grid-cols-2 lg:grid-cols-4">
            <div className="flex h-25 items-center justify-center rounded-2xl bg-red-200 p-4">TITULO POST</div>
            <div className="flex h-25 items-center justify-center rounded-2xl bg-green-200 p-4">AUTHOR</div>
            <div className="col-span-2 flex h-25 items-center justify-center rounded-2xl bg-yellow-200 p-4">GESTION BACKEND</div>
            <div className="col-span-2 flex h-25 items-center justify-center rounded-2xl bg-blue-200 p-4">SECCIONES</div>
            <div className="col-span-2 row-span-2 hidden h-full items-center justify-center rounded-2xl bg-gray-400 p-4 lg:flex">CARD</div>

        </div>
    )
}

export default BlocManageInfo