import { Button } from "@/components/animate-ui/components/buttons/button";
import { cn } from "@/lib/utils";
import { Lang } from "@/store/lang-store";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";



export type SectionsTypes = {
    max: number,
    min: number,
}

export type BlocSectionTypes = "numbers" | "names"


interface BlocSectionBaseProps {
  className: string;
  lang: Lang;
}

interface NumbersSectionProps extends BlocSectionBaseProps {
  variant: "numbers";
  sections: SectionsTypes;
  /** Sección actual (entre min y max) si la controla el padre */
  value?: number;
  onChange?: (section: number) => void;
}

interface NamesSectionProps<T> extends BlocSectionBaseProps {
  variant: "names";
  sections: T[];
  /** Texto a mostrar para cada elemento */
  getLabel: (item: T) => string;
  /** Sección (base 0) desde la que empezar */
  initialIndex?: number;
  onChange?: (item: T, index: number) => void;
}

export type BlocSectionPageProps<T> = NumbersSectionProps | NamesSectionProps<T>;

/**
 * Devuelve el índice del primer elemento que cumple el predicado,
 * o 0 si no hay ninguno. Sirve para calcular `initialIndex`.
 */
export const findSectionIndex = <T,>(items: T[], predicate: (item: T) => boolean): number =>
    Math.max(items.findIndex(predicate), 0);

export const BlocSectionPage = <T,>(props: BlocSectionPageProps<T>) => {

    const { className, lang } = props;

    // names empieza en initialIndex; numbers sigue a `value` si el padre lo controla, si no la primera
    const startIndex = props.variant === "names"
        ? (props.initialIndex ?? 0)
        : (props.value !== undefined ? props.value - props.sections.min : 0);

    // Índice interno (base 0) común a ambas variantes
    const [index, setIndex] = useState(startIndex);

    // Si el padre cambia la sección inicial (p. ej. otro usuario), se sincroniza
    useEffect(() => {
        setIndex(startIndex);
    }, [startIndex]);

    // Total de secciones según la variante
    const total = props.variant === "numbers"
        ? Math.max(props.sections.max - props.sections.min + 1, 0)
        : props.sections.length;

    // Estados derivados: no necesitan useState ni useEffect
    const prev = index <= 0;
    const next = index >= total - 1;

    const goTo = (i: number) => {
        const clamped = Math.min(Math.max(i, 0), Math.max(total - 1, 0));
        setIndex(clamped);

        if (props.variant === "numbers") props.onChange?.(props.sections.min + clamped);
        else props.onChange?.(props.sections[clamped], clamped);
    };

    const title = lang === 'es' ? "Sección" : "Section";

    // Etiqueta visible según la variante
    const label = props.variant === "numbers"
        ? `${title} ${props.sections.min + index} / ${props.sections.max}`
        : props.sections[index] !== undefined ? props.getLabel(props.sections[index]) : "";


    return (
        <div className={`${className}`}>
            <div className="w-full h-full bg-mizume-primary flex flex-row justify-between items-center rounded-xl text-sm">

                <div className="p-2">
                    <Button variant={"default"} className="bg-mizume-fourthary hover:bg-mizume-secondary hover:text-mizume-secondary-foreground" onClick={() => goTo(index - 1)} disabled={prev}>
                        <ArrowLeft />
                    </Button>
                </div>

                <div className="p-2 flex flex-col items-center min-w-0">
                    <span className="title truncate">
                        {label}
                    </span>
                    {props.variant === "names" && total > 0 && (
                        <span className="text-xs opacity-70">
                            {index + 1} / {total}
                        </span>
                    )}
                </div>


                <div className="p-2">
                    <Button variant={"default"} className="bg-mizume-fourthary hover:bg-mizume-secondary hover:text-mizume-secondary-foreground " onClick={() => goTo(index + 1)} disabled={next}>
                        <ArrowRight />
                    </Button>
                </div>

            </div>
        </div>
    )
}






interface BlocTabsProps<T extends string> {
    /** Valores fijos (no traducidos) */
    tabs: readonly T[];
    /** Etiqueta traducida de cada valor */
    labels: Record<T, string>;
    /** Valor activo (controlado por el padre) */
    value: T;
    onChange: (tab: T) => void;
    className?: string;
}

/**
 * Pestañas genéricas y controladas: reparten el ancho entre N labels (flex-1)
 * y un indicador que se desliza hacia la pestaña activa.
 * Trabajan con el valor, no con el label: al cambiar de idioma solo cambia el texto.
 */
export const BlocTabs = <T extends string>({ tabs, labels, value, onChange, className }: BlocTabsProps<T>) => {
    const activeIndex = Math.max(tabs.indexOf(value), 0);

    return (
        <div className={className}>
            <div className="relative flex h-full w-full flex-row">
                {tabs.map((t) => (
                    <div
                        key={t}
                        onClick={() => onChange(t)}
                        className={cn(
                            'flex-1 text-mizume-tertiary flex flex-row items-center justify-center cursor-pointer transition-opacity duration-300 ease-out',
                            value === t ? 'opacity-100' : 'opacity-60 hover:opacity-90',
                        )}
                    >
                        {labels[t]}
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