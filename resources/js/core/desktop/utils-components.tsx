import { Author, Post, Work, WorkRecord } from "@/types/definitions";
import React, { ReactNode, useMemo } from "react";
import { Fragment } from 'react'
interface AvatarProps {
    name?: string;
    /** Identificador estable (p. ej. user.uuid) usado para calcular el color */
    seed?: string;
    className?: string
}

export type BlogContentType = "works" | "authors" | "posts"
export type BlogObjectType = Work | Author | Post


export const DATA_ENTITIES = {
    es: {
        work: {
            title: "Titulo",
            abbreviation: "Abbreviation",
            category: "Categoria",
            publish_date: "Fecha Pub.",
            medium: "Medio",
            tags: "Etiquetas",
            sinopsi: "Sinopsi",
            authors: "Autores"
        },
        post: {
            title: "Titulo",
            publish_date: "Fecha Pub.",
            description: "Descripcion",
            featured: "Destacado",
            code: "Codigo",
            type: "Articulo"
        },
        author: {
            name: "Nombre",
            last_name: "Apellido",
            pseudonym: "Pseudonimo",
            description: "Descripcion",
            birth_year: "Año Nacimiento",
        },

    },
    en: {
        work: {
            title: "Title",
            abbreviation: "Abreviatura",
            category: "Category",
            publish_date: "Publish date",
            authors: "Author",
            medium: "Medium",
            tags: "Tags",
            sinopsi: "Synopsis"
        },
        post: {
            title: "Title",
            publish_date: "Publish Date",
            description: "Description",
            featured: "Featured",
            code: "Code",
            type: "Article"
        },
        author: {
            name: "Name",
            last_name: "Last Name",
            pseudonym: "Pseudonym",
            description: "Description",
            birth_year: "Birth Year",
        },
    }
}

export type DATA_ENTITIES_TYPE = typeof DATA_ENTITIES.es
export type WORK_LABELS = DATA_ENTITIES_TYPE["work"]
export type AUTHOR_LABELS = DATA_ENTITIES_TYPE["author"]


/**
 * Color estable a partir de un texto (uuid/id/nombre).
 * Usa 360 tonos HSL en vez de una paleta fija: casi sin colisiones
 * y con luminosidad baja para que la inicial blanca siempre se lea.
 */
function getColorFromSeed(seed: string): string {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (seed.charCodeAt(i) + ((hash << 5) - hash)) | 0;
    }
    const hue = Math.abs(hash) % 360;
    const saturation = 50 + (Math.abs(hash >> 8) % 20); // 50–69 %
    const lightness = 30 + (Math.abs(hash >> 16) % 10); // 30–39 %
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function BlogProfile({ name, seed, className = "" }: AvatarProps) {

    const initial = useMemo(() => {
        if (!name) return "?";
        return name.trim().charAt(0).toUpperCase();
    }, [name]);

    // Prioriza el seed (uuid) para que dos usuarios con el mismo nombre no compartan color
    const key = seed ?? name;

    const bgColor = useMemo(() => {
        if (!key) return "#3D1F08";
        return getColorFromSeed(key);
    }, [key]);

    return (
        <div
            className={className}
            style={{ backgroundColor: bgColor }}
        >
            <span
                className="text-white font-bold"
                style={{ fontSize: "14px", lineHeight: 1 }}
            >
                {initial}
            </span>
        </div>
    );
}



interface BlogTopUtilProps {
    variant: BlogContentType,
    children: ReactNode
}

export const BlogTopUtil = ({ children }: BlogTopUtilProps) => {
    return (
        <>
            <h2 className="title">Opciones de Filtrado</h2>
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

// Lado izquierdo: filtros secundarios (tags, fechas), apilados en columna
export const BlogTopUtilLeft = ({ children, className = "" }: BlogTopUtilSideProps) => {
    return (
        <div className={`lg:col-span-5 flex flex-col gap-4 rounded-xl p-4 *:min-w-0 ${className}`}>
            {children}
        </div>
    )
}

// Lado derecho: filtros principales (categorías, select, buscador) en grid de 2 columnas
export const BlogTopUtilRight = ({ children, className = "" }: BlogTopUtilSideProps) => {
    return (
        <div className={`lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 content-start gap-4 rounded-xl p-4 *:min-w-0 ${className}`}>
            {children}
        </div>
    )
}






export interface BlogCardProps {
    variant: BlogContentType,
    onId: (id: number) => void
    selectd: BlogObjectType,
}


interface BlogItemsProps<T extends Record<string, unknown>> {
    data: T;
    formatKey?: (key: keyof T & string, data: T) => ReactNode;
    formatValue?: (value: T[keyof T], key: keyof T & string, data: T) => ReactNode;
    omit?: (keyof T & string)[];
    keyClass: string,
    labelClass: string,
}


export function BlogItems<T extends Record<string, unknown>>({
    data,
    formatKey = (key) => key,
    formatValue = (value) => String(value ?? "—"),
    omit = [],
    keyClass,
    labelClass
}: BlogItemsProps<T>) {
    const entries = (Object.keys(data) as (keyof T & string)[]).filter(
        (key) => !omit.includes(key)
    );

    return (
        <dl className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2">
            {entries.map((key) => (
                <Fragment key={key}>
                    <dt className={`${keyClass}`}>
                        {formatKey(key, data)}
                    </dt>
                    <dd className={`${labelClass}`}>
                        {formatValue(data[key], key, data)}
                    </dd>
                </Fragment>
            ))}
        </dl>
    );
}



interface FilterSearchProps {
    search: string,
    setSearch: (v: string) => void,
    onFilter: () => void,
    placeholder: string,
    content: string,
    inputClass: string
}


export const FilterSearch = ({ search, setSearch, onFilter, placeholder }: FilterSearchProps) => {
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




{ /*export function BlogCard({ variant , onId , selectd }: BlogCardProps) {
   
    const tags = post.tags.split(',').map((g) => g.trim()) ?? [];

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (edit) {
            e.preventDefault();
            onID(post.id);
        }
    };

    const [format, SetFormat] = useState<BackgroundPositionKeywordCard | null>(null);

    useEffect(() => {
        if (selectPost.id !== post.id) return;
        SetFormat(position ?? (selectPost.config?.card as BackgroundPositionKeywordCard));
    }, [selectPost, position]);

    return (
        <a
            href="#"
            className={`group relative focus:outline-none`}
        >
            <div className="flex h-[280px] w-full flex-col overflow-hidden rounded-[25px] border-[2px] border-black bg-[#d2a264] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 group-hover:z-10 group-hover:scale-[1.02]">
               
                <header className="flex h-[46px] shrink-0 items-center justify-between border-b-[2px] border-black bg-[#c59454] px-4 text-black">
                    <h2 className="truncate pr-2 text-sm font-bold tracking-tight uppercase">{post.title.replaceAll('-', ' ')}</h2>
                    <div className="flex shrink-0 gap-1">
                        {tags.slice(0, 1).map((g) => (
                            <span key={g} className="rounded-full bg-[#8c6c44] px-3 py-1 text-[0.6rem] font-bold text-white uppercase shadow-sm">
                                {g}
                            </span>
                        ))}
                    </div>
                </header>

              
                <main className="flex h-full flex-row overflow-hidden">
                 
                    <section className="w-[35%] shrink-0 overflow-hidden border-r-[2px] border-black/20 bg-[#e5e5e5] sm:w-[30%]">
                        {post.cover_card ? (
                            <img
                                src={`/IMG/Cards/${post.cover_card}`}
                                alt={`Portada de ${post.title}`}
                                className="h-full w-full object-cover object-center"
                                style={{ objectPosition: format ?? post.config?.card ?? 'center' }}
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-2xl opacity-30">📖</div>
                        )}
                    </section>

                    <section className="flex-1 overflow-y-auto bg-[#d2b48c] p-4 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/20">
                        <p className="mb-1 text-[0.6rem] font-medium tracking-widest text-black/60 uppercase">
                            {post.author} · {post.publish_date}
                        </p>
                        <h3 className="mb-2 text-base leading-tight font-extrabold text-black capitalize">{post.web_title.replaceAll('-', ' ')}</h3>
                        <p className="text-xs leading-relaxed font-medium text-black/90">{post.description}</p>
                    </section>
                </main>
            </div>
        </a>
    );
} */}

interface BlogCardWorkProps {
    work: WorkRecord,
    WORK: DATA_ENTITIES_TYPE
}

export const BlogCardWork = ({ work, WORK }: BlogCardWorkProps) => {

    const WORK_EXCLUDE = [
        "id", "created_at", "updated_at", "title", "sinopsi",
        "abbreviation", "tags", "media", "pivot", "cover_url",
    ] as const


    return (
        <a
            href="#"
            className={`group relative focus:outline-none`}
        >
            <div className="flex min-h-70 w-full flex-col overflow-hidden rounded-[25px] border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 group-hover:z-10 group-hover:scale-[1.02]">

                <header className="flex h-11.5 shrink-0 items-center justify-between border-b-2 border-black bg-card  px-4 text-black">
                    <h2 className="truncate pr-2 text-sm font-bold tracking-tight uppercase">{work.title.replaceAll('-', ' ')}</h2>
                    <div className="flex shrink-0 gap-1">
                        {work.tags.slice(0, 1).map((g, i) => (
                            <span key={i} className="rounded-full bg-[#8c6c44] px-3 py-1 text-[0.6rem] font-bold text-white uppercase shadow-sm">
                                {g.name}
                            </span>
                        ))}
                    </div>
                </header>


                <main className="flex h-full flex-row overflow-hidden">

                    <section className="w-[35%] shrink-0 overflow-hidden border-r-2 border-black/20 bg-[#e5e5e5] sm:w-[30%]">
                        {work.cover_url ? (
                            <img
                                src={`${work.cover_url}`}
                                alt={`Portada de ${work.title}`}
                                className="h-full w-full object-cover object-center"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-2xl opacity-30">📖</div>
                        )}
                    </section>


                    <section className=" flex-1 overflow-y-auto bg-card-foreground p-4 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/20">
                        {/* <BlogItems
                            data={work}
                            omit={[...WORK_EXCLUDE]}
                            formatKey={(key) => (ENTITIES.work as Record<string, string>)[key] ?? key}
                            formatValue={(value, key) => {
                                if (key === "publish_date" && typeof value === "string") return formatDate(value)
                                if (key === "authors" && Array.isArray(value)) return value.map((a) => a.name).join(", ")
                                return String(value).replaceAll("_", " ")
                            }}
                        /> */}
                    </section>
                </main>
            </div>
        </a>
    )
}

/** Helpers */
export function ChangeKey(key: string, ENTITIES: DATA_ENTITIES_TYPE, ENTITY: BlogContentType): string {
    let label = ""
    if (ENTITY === "authors") {

    } else if (ENTITY === "posts") {

    } else if (ENTITY === "works") {
        label = ChangeKeyWork(key, ENTITIES.work)
    }
    return label

}

function ChangeKeyPost(key: string, ENTITIES: DATA_ENTITIES_TYPE) {
    switch (key) {
        case "title":
            return ENTITIES.post.title
        case "description":
            return ENTITIES.post.description
        case "featured":
            return ENTITIES.post.featured
        case "publish_date":
            return ENTITIES.post.publish_date
        case "type":
            return ENTITIES.post.type
        default:
            return "NOT FOUND"
    }
}

function ChangeKeyAuthor(key: string, ENTITIES: DATA_ENTITIES_TYPE) {
    switch (key) {
        case "name":
            return ENTITIES.author.name
        case "last_name":
            return ENTITIES.author.last_name
        case "pseudony":
            return ENTITIES.author.pseudonym
        case "description":
            return ENTITIES.author.description
        case "birth_year":
            return ENTITIES.author.birth_year
        default:
            return "NOT FOUND"
    }
}

function ChangeKeyWork(key: string, ENTITIES: WORK_LABELS) {
    switch (key) {
        case "category":
            return ENTITIES.category
        case "publish_date":
            return ENTITIES.publish_date
        case "medium":
            return ENTITIES.medium
        case "authors":
            return ENTITIES.authors
        case "tags":
            return ENTITIES.tags
        default:
            return "NOT FOUND"
    }
}