/**
 * @fileoverview Bloque de metricas he informacion
 */
import { Lang } from "@/store/lang-store";
import { PostRecord, Tag } from "@/types/definitions";
import { Link, router } from '@inertiajs/react';
import { confirmDelete, SECTION, Section, Section_Content } from '@/types';
import Switch from "react-switch";
import { useState } from 'react';
import { Edit2, Eye, Filter, Pin, RotateCcwIcon, Trash2 } from 'lucide-react';
import { DATA } from '@/constants/main-constants';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { now } from "@/lib/utils";
import { StatsPosts } from "@/types/custom/workshop-types";
import { FilterSearch } from "@/core/desktop/utils-components";
import { DATA_WORKSHOP_TYPE, WORKSHOP_POST_TABS_TYPE } from "@/constants/workshop-constants";
import { TurtleService } from "@/custom/services";
import { BlocSelectTabs, BlocTabs } from "./bloc-manage-info";

interface InfoCurrentActivityProps {
    posts: PostRecord[],
    lang: Lang
}

const InfoCurrentActivitytext = {
    es: {
        title: "Actividad Reciente",
        draft: "Borrador",
    },
    en: {
        title: "Recent activity",
        draft: "Draft"
    }
}

export function InfoCurrentActivity({ posts, lang }: InfoCurrentActivityProps) {

    const POSTS = posts.slice(0, 3);

    const DATA = InfoCurrentActivitytext[lang]

    return (
        <div className="rounded-xl border bg-card border-card-foreground shadow-card-foreground shadow-lg w-full">
            <div className="border-b border-card-foreground px-5 py-4">
                <h3 className="text-card-foreground">{DATA.title}</h3>
            </div>
            <div className="p-1 capitalize">
                {POSTS.map((act, i) => (
                    <div key={i} className="flex gap-3 border-b border-card-foreground/40 p-3 last:border-0 text-card-foreground cursor-pointer hover:bg-card-muted hover:text-card-muted-foreground">

                        {act.publish_date === null ? (
                            <>
                                <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full bg-btn-warning`}></div>
                            </>
                        ) : (
                            <>
                                <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full bg-btn-success`}></div>
                            </>
                        )

                        }

                        <div>
                            <p className="text-xs leading-snug text-inherit">{act.title}</p>
                            <p className="text-[10px] text-card-muted-foreground italic">{act.publish_date ?? DATA.draft}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}



interface InfoProgresBarProps {
    posts: PostRecord[],
    lang: Lang
}

const InfoProgresBartext = {
    es: {
        title: "Métricas por categoria"
    },
    en: {
        title: "Metrics by category"
    }
}

export function InfoProgresBar({ posts, lang }: InfoProgresBarProps) {

    const works = Array.from(
        new Map(
            posts.flatMap(post => post.works).map(work => [work.id, work])
        ).values()
    );

    const DATA = InfoProgresBartext[lang]

    const lit = lang === "es" ? "Literatura" : "Literature"

    const v1 = works.filter((p) => p.category === 'literatura');
    const v2 = works.filter((p) => p.category === 'animemanga');

    const Literatura = (v1.length * 100) / posts.length;
    const AnimeManga = (v2.length * 100) / posts.length;

    const r1 = Math.round(Literatura).toString();
    const r2 = Math.round(AnimeManga).toString();

    return (
        <div className="bg-card  border-card border rounded-xl p-5 shadow-card-foreground shadow-2xl w-full">
            <h3 className="text-card-foreground mb-4">{DATA.title}</h3>
            <div className="space-y-4">
                {[
                    { label: lit, val: v1.length, width: r1 },
                    { label: 'AnimeManga', val: v2.length, width: r2 },
                ].map((g, i) => (
                    <div key={i}>
                        <div className="flex justify-between text-xs mb-1 italic text-card-foreground">
                            <span>{g.label}</span>
                            <span className="font-bold">{g.val}</span>
                        </div>
                        <div className="h-1.5 bg-card-muted rounded-full overflow-hidden">
                            <div
                                style={{ width: `${g.width}%` }}
                                className={`h-full bg-card-muted-foreground rounded-full`}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

interface InfoTagsContentProps {
    posts: PostRecord[],
    lang: Lang,
    /** Máximo de tags a mostrar (por defecto 8) */
    limit?: number
}

const InfoTagsContenttext = {
    es: {
        title: "Tus géneros",
        subtitle: "Presencia en tus posts",
        empty: "Aún no hay tags en las obras sobre las que has escrito.",
        unique: "distintos",
    },
    en: {
        title: "Your genres",
        subtitle: "Presence in your posts",
        empty: "There are no tags yet in the works you have written about.",
        unique: "unique",
    }
}

/** Los works de PostRecord no tipan tags; llegan cuando el controlador carga `works.tags` */
type WorkWithTags = PostRecord["works"][number] & { tags?: Tag[] }

export function InfoTagsContent({ posts, lang, limit = 8 }: InfoTagsContentProps) {

    const DATA = InfoTagsContenttext[lang]

    // Cuenta en cuántos posts aparece cada tag (un tag repetido en varias obras del mismo post cuenta una vez)
    const counts = new Map<number, { name: string, count: number }>()

    posts.forEach(post => {
        const tagsInPost = new Map<number, string>()

            ; (post.works as WorkWithTags[]).forEach(work => {
                work.tags?.forEach(tag => tagsInPost.set(tag.id, tag.name))
            })

        tagsInPost.forEach((name, id) => {
            const current = counts.get(id)
            counts.set(id, { name, count: (current?.count ?? 0) + 1 })
        })
    })

    const TAGS = Array.from(counts.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)

    const max = TAGS[0]?.count ?? 0

    return (
        <div className="bg-card border-card border rounded-xl p-5 shadow-card-foreground shadow-2xl">
            <div className="flex items-baseline justify-between mb-1">
                <h3 className="text-card-foreground">{DATA.title}</h3>
                {counts.size > 0 && (
                    <span className="text-[10px] italic text-card-muted-foreground">
                        {counts.size} {DATA.unique}
                    </span>
                )}
            </div>
            <p className="text-[10px] italic text-card-muted-foreground mb-4">{DATA.subtitle}</p>

            {TAGS.length === 0 ? (
                <p className="text-xs italic text-card-muted-foreground">{DATA.empty}</p>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {TAGS.map((tag, i) => {
                        const percent = Math.round((tag.count * 100) / posts.length)
                        // Los tags más frecuentes se resaltan; el resto queda en tono apagado
                        const strong = tag.count >= max * 0.6

                        return (
                            <div
                                key={i}
                                title={`${percent}%`}
                                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs italic capitalize transition-colors
                                    ${strong
                                        ? 'bg-card-muted-foreground text-card border-card-muted-foreground'
                                        : 'bg-card-muted text-card-foreground border-card-foreground/40 hover:bg-card-muted-foreground hover:text-card'
                                    }`}
                            >
                                <span>#{tag.name}</span>
                                <span className="font-bold not-italic text-[10px] opacity-80">{percent}%</span>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}




interface InfoWritingRhythmProps {
    posts: PostRecord[],
    lang: Lang,
    /** Meses a mostrar en las barras (por defecto 6) */
    months?: number
}

const InfoWritingRhythmtext = {
    es: {
        title: "Ritmo de escritura",
        subtitle: (n: number) => `Posts por mes · últimos ${n} meses`,
        streak: (n: number) => n === 1 ? "Llevas 1 semana escribiendo" : `Llevas ${n} semanas seguidas escribiendo`,
        noStreak: "Sin racha activa, ¡escribe algo esta semana!",
        total: "en el periodo",
        best: "Mejor mes",
    },
    en: {
        title: "Writing rhythm",
        subtitle: (n: number) => `Posts per month · last ${n} months`,
        streak: (n: number) => n === 1 ? "1 week writing" : `${n} weeks in a row writing`,
        noStreak: "No active streak, write something this week!",
        total: "in this period",
        best: "Best month",
    }
}

/** Lunes 00:00 de la semana de una fecha, como timestamp */
function weekStart(date: Date): number {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const day = (d.getDay() + 6) % 7 // lunes = 0
    d.setDate(d.getDate() - day)
    return d.getTime()
}

export function InfoWritingRhythm({ posts, lang, months = 6 }: InfoWritingRhythmProps) {

    const DATA = InfoWritingRhythmtext[lang]

    // Fecha en la que nos basamos: created_at (cambiar a publish_date para contar solo publicados)
    const dates = posts
        .map(post => new Date(post.created_at))
        .filter(d => !isNaN(d.getTime()))

    // --- Barras por mes ---
    const now = new Date()
    const MONTHS = Array.from({ length: months }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1)
        const count = dates.filter(
            date => date.getFullYear() === d.getFullYear() && date.getMonth() === d.getMonth()
        ).length

        return {
            label: d.toLocaleDateString(lang, { month: 'short' }).replace('.', ''),
            count,
            current: i === months - 1,
        }
    })

    const max = Math.max(...MONTHS.map(m => m.count), 0)
    const total = MONTHS.reduce((acc, m) => acc + m.count, 0)
    const best = max > 0 ? MONTHS.find(m => m.count === max) : undefined

    // --- Racha de semanas consecutivas con al menos un post ---
    const weeks = new Set(dates.map(weekStart))
    const ONE_WEEK = 7 * 24 * 60 * 60 * 1000

    // Si esta semana aún no hay post, la racha sigue viva desde la semana pasada
    let cursor = weekStart(now)
    if (!weeks.has(cursor)) cursor -= ONE_WEEK

    let streak = 0
    while (weeks.has(cursor)) {
        streak++
        cursor -= ONE_WEEK
    }

    return (
        <div className="bg-card border-card border rounded-xl p-5 shadow-card-foreground shadow-2xl w-full">
            <div className="flex items-baseline justify-between mb-1">
                <h3 className="text-card-foreground">{DATA.title}</h3>
                <span className="text-[10px] italic text-card-muted-foreground">
                    <span className="font-bold not-italic text-card-foreground">{total}</span> {DATA.total}
                </span>
            </div>
            <p className="text-[10px] italic text-card-muted-foreground mb-4">{DATA.subtitle(months)}</p>

            {/* Barras */}
            <div className="flex items-end gap-2 h-24">
                {MONTHS.map((m, i) => {
                    const height = max > 0 ? Math.max((m.count * 100) / max, m.count > 0 ? 8 : 0) : 0

                    return (
                        <div key={i} className="group flex flex-1 flex-col items-center gap-1 h-full">
                            <span className="text-[10px] font-bold text-card-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                {m.count}
                            </span>
                            <div className="flex w-full flex-1 items-end rounded-md bg-card-muted overflow-hidden">
                                <div
                                    style={{ height: `${height}%` }}
                                    className={`w-full rounded-md transition-all
                                        ${m.current ? 'bg-card-foreground' : 'bg-card-muted-foreground'}`}
                                ></div>
                            </div>
                            <span className={`text-[10px] italic capitalize
                                ${m.current ? 'text-card-foreground font-bold' : 'text-card-muted-foreground'}`}>
                                {m.label}
                            </span>
                        </div>
                    )
                })}
            </div>

            {/* Racha + mejor mes */}
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-card-foreground/40 pt-3 text-xs italic text-card-foreground">
                <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 shrink-0 rounded-full ${streak > 0 ? 'bg-btn-success' : 'bg-btn-warning'}`}></div>
                    <span>{streak > 0 ? DATA.streak(streak) : DATA.noStreak}</span>
                </div>
                {best && (
                    <span className="text-[10px] text-card-muted-foreground whitespace-nowrap">
                        {DATA.best}: <span className="font-bold not-italic text-card-foreground capitalize">{best.label}</span>
                    </span>
                )}
            </div>
        </div>
    )
}

interface InfoLastPostProps {
    posts: PostRecord[],
    lang: Lang
}


const InfoLastPosttext = {
    es: {
        title: "Ultima Publicacion Editada"
    },
    en: {
        title: "Last Edited Post"
    }
}

export const InfoLastPost = ({ posts, lang }: InfoLastPostProps) => {



    const DATA = InfoLastPosttext[lang]

    return (
        <div className="bg-card border-card border rounded-xl p-5 shadow-card-foreground shadow-2xl w-full">
            <div className="flex items-center justify-start mb-4">
                <h3 className="text-card-foreground">{DATA.title}</h3>
            </div>
            <div className="bg-card-foreground text-card rounded-2xl p-4 " >
                <a href={route('works.posts.show', [posts[0].works[0].slug, posts[0].id])} className="text-md text-card transition-transform duration-300 hover:border-b hover:border-b-card ease-in-out cursor-pointer">{posts[0].title}</a>
            </div>
        </div>
    )
}


interface InfoPanelProps {
    stats: StatsPosts,
    lang: Lang
}

export function InfoPanel({ stats, lang }: InfoPanelProps) {




    const InfoPanelNav = {
        es: [
            {
                label: 'Publicaciones',
                val: stats.publish
            },
            {
                label: 'Borradores',
                val: stats.drafts
            },
            {
                label: 'Pendientes',
                val: stats.pending
            },
            {
                label: 'Comentarios',
                val: stats.comments
            }
        ]
        ,
        en: [
            {
                label: 'Publish Posts',
                val: stats.publish
            },
            {
                label: 'Drafts',
                val: stats.drafts
            },
            {
                label: 'Pending',
                val: stats.pending
            },
            {
                label: 'Comments',
                val: stats.comments
            }
        ]
    }

    const DATA = InfoPanelNav[lang]

    return (
        <div className="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-4">
            {DATA.map((stat, i) => (
                <div key={i} className="bg-card border-card border rounded-xl p-5 relative overflow-hidden group">
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-card-muted/40"></div>
                    <p className="text-[11px] uppercase tracking-widest text-card-foreground mb-2">{stat.label}</p>
                    <p className="text-3xl text-card-foreground">{stat.val}</p>
                </div>
            ))}
        </div>
    )
}


interface InfoTableProps {
    posts: PostRecord[];
    lang: Lang,
    search: string,
    setSearch: (v: string) => void,
    onFilter: () => void,
    TEXT: DATA_WORKSHOP_TYPE,
    postTab: WORKSHOP_POST_TABS_TYPE,
    setPostTab: (v: WORKSHOP_POST_TABS_TYPE) => void,
    onReset: () => void

}

const InfoTableText = {
    es: {
        title: "Tabla de Publicaciones",
        header: ["Titulo", "Estado", "Fecha Publi.", "Destacado", "Acciones"],
        status: {
            publish: "Publicado",
            draft: "Borrador",
        }
    },
    en: {
        title: "Posts Table",
        header: ["Title", "Status", "Publish Date", "Featured", "Actions"],
        status: {
            publish: "Publish",
            draft: "Draft",
        }
    }
}


/* ─────────── Piezas compartidas por la vista desktop y la mobile ─────────── */

type InfoTableData = (typeof InfoTableText)[Lang]

interface StatusBadgeProps {
    lang: Lang,
    post: PostRecord,
}

/** Badge de estado: publicado / borrador */
const StatusBadge = ({ lang, post }: StatusBadgeProps) => {
    const today = now();

    const TEXT = {
        es: {
            publish: "Publicada",
            draft: "Borrador",
            pending: "Pendiente"
        },
        en: {
            publish: "Publish",
            draft: "Draft",
            pending: "Pending"
        }
    }
    {/* Tres Estados: Draft  | Publish | Pending */ }

    const DATA = TEXT[lang]

    const BadgeStatus = {
        publish: {
            text: DATA.publish,
            css: "text-btn-success bg-btn-success/10 border-btn-success/30"
        },
        draft: {
            text: DATA.draft,
            css: "text-btn-danger bg-btn-danger/10 border-btn-danger/30"
        },
        pending: {
            text: DATA.pending,
            css: "text-secondary-foreground bg-accent/40 border-accent"
        }
    }
    type BadgeStatusType = typeof BadgeStatus.pending
    let result: BadgeStatusType;

    if (post.publish_date) {
        // "YYYY-MM-DD" → medianoche LOCAL (new Date("YYYY-MM-DD") la toma como UTC)
        const [y, m, d] = post.publish_date.slice(0, 10).split('-').map(Number)
        const publishDay = new Date(y, m - 1, d)
        result = today < publishDay ? BadgeStatus.pending : BadgeStatus.publish
    } else {
        result = BadgeStatus.draft
    }



    return (
        <span className={`text-[11px] font-bold px-2 py-1 rounded-full border whitespace-nowrap ${result.css}`}>
            {result.text}
        </span>
    )

}
/** Marca de destacado */
const FeaturedMark = ({ featured }: { featured: boolean }) => (
    featured ? <Pin className="text-mizume-primary-foreground" /> : null
)

/** Base común: mismo tamaño en todos los botones (más grande en mobile para tocar con el dedo) */
const actionBtn = "size-9 md:size-8 p-0 shrink-0 flex items-center justify-center border border-border rounded transition-colors cursor-pointer"

/** Acciones de cada post: ver, editar, borrar */
const PostActions = () => (
    <div className="flex shrink-0 gap-2">
        <Button className={`${actionBtn} bg-btn-info text-btn-info-foreground hover:bg-btn-info-foreground hover:text-btn-info hover:border-muted-foreground`}>
            <Eye size={16} />
        </Button>
        <Button className={`${actionBtn} bg-mizume-tertiary text-mizume-tertiary-foreground hover:bg-mizume-tertiary-foreground hover:text-mizume-tertiary hover:border-muted-foreground`}>
            <Edit2 size={16} />
        </Button>
        <Button className={`${actionBtn} bg-btn-danger text-btn-danger-foreground hover:bg-btn-danger-foreground hover:text-btn-danger`}>
            <Trash2 size={16} />
        </Button>
    </div>
)

export function InfoTable({ posts, lang, search, setSearch, onFilter, TEXT, postTab, setPostTab, onReset }: InfoTableProps) {

    const [publish, setPublish] = useState(false);

    const handleDelete = (id: number, title: string) => {
        confirmDelete(
            '¿Eliminar Post?',
            `Esta acción borrará "${title}" permanentemente.`,
            () => router.delete(route('post.destroy', id))
        );
    };

    const DATA = InfoTableText[lang]

    /** Misma regla de filtrado para las dos vistas */


    return (
        <div className="@container lg:col-span-2 bg-mizume-primary border border-border rounded-xl overflow-hidden shadow-sm h-full">

        
            <div className="grid grid-cols-2 items-center gap-3 px-4 py-3 @2xl:px-5 @2xl:py-4 @2xl:grid-cols-[16rem_minmax(0,1fr)_auto_auto] @5xl:grid-cols-[18rem_minmax(0,1fr)_auto_auto] border-b border-border bg-gradient-to-r from-accent/40 to-transparent">

                {/* Buscador */}
                <div className="col-span-2 @2xl:col-span-1 h-16 flex flex-col justify-center bg-mizume-fourthary p-2 rounded-2xl">
                    <div className="w-full bg-mizume-primary text-mizume-primary rounded-2xl">
                        <FilterSearch
                            search={search}
                            onFilter={onFilter}
                            setSearch={setSearch}
                            content="bg-input-border rounded-md p-1"
                            inputClass="w-full bg-input text-input-foreground placeholder:text-input-placeholder p-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-input-focus"
                            placeholder={TEXT.filter.search.placeholder}
                        />
                    </div>
                </div>

                {/* Filtro de estado: select hasta @5xl, pestañas desde @5xl */}
                <div className="col-span-2 @2xl:col-span-1 min-w-0">
                    <BlocTabs tabs={TEXT.filter.WORKSHOP_POST_TABS} labels={TEXT.filter.POST_LABELS} value={postTab} onChange={setPostTab} className='hidden @5xl:flex w-full flex-row h-16 items-center justify-center rounded-2xl bg-mizume-fourthary px-8 py-2' />

                    <BlocSelectTabs
                        tabs={TEXT.filter.WORKSHOP_POST_TABS}
                        labels={TEXT.filter.POST_LABELS}
                        value={postTab}
                        onChange={setPostTab}
                        className="@5xl:hidden w-full"
                    />
                </div>

                <Button variant={`default`} className="w-full bg-btn-success text-btn-success-foreground hover:bg-btn-success-foreground hover:text-btn-success" onClick={onFilter}>
                    <Filter />
                    { TEXT.filter.apply}
                </Button>
                <Button variant={`default`} className="w-full bg-btn-danger text-btn-danger-foreground hover:bg-btn-danger-foreground hover:text-btn-danger" onClick={onReset} >
                    <RotateCcwIcon />
                    {TEXT.filter.reset}
                </Button>

            </div>

            {/* Vista tablet/desktop: tabla (md–xl: Fecha y Destacado pasan bajo el título) */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-accent/20 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
                        <tr>
                            {DATA.header.map((p, i) => (
                                <th
                                    key={p}
                                    /* 2 = Fecha, 3 = Destacado: solo como columna desde xl */
                                    className={`px-4 xl:px-5 py-3 font-semibold whitespace-nowrap ${i === 2 || i === 3 ? 'hidden xl:table-cell' : ''}`}
                                >
                                    {p}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {posts.map((post, i) => (
                            <tr key={i} className={`hover:bg-accent/20 capitalize transition-colors group`}>
                                {/* Campo titulo (+ fecha y destacado por debajo de xl) */}
                                <td className="px-4 xl:px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 shrink-0 bg-secondary rounded flex items-center justify-center text-lg border border-border">{TurtleService.bullet}</div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p
                                                    title={post.title.replaceAll('-', ' ')}
                                                    className="max-w-[16rem] xl:max-w-sm truncate text-sm font-semibold text-mizume-primary-foreground"
                                                >
                                                    {post.title.replaceAll('-', ' ')}
                                                </p>
                                                <span className="xl:hidden shrink-0">
                                                    <FeaturedMark featured={post.featured} />
                                                </span>
                                            </div>
                                            {post.publish_date && (
                                                <p className="xl:hidden text-[11px] font-light text-mizume-primary-foreground">{post.publish_date}</p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                {/* Campo Estado */}
                                <td className="px-4 xl:px-5 py-4">
                                    <StatusBadge lang={lang} post={post} />
                                </td>

                                {/* Campo Fecha */}
                                <td className='hidden xl:table-cell px-5 py-4'>
                                    <p className='text-sm font-light whitespace-nowrap text-mizume-primary-foreground'>{post.publish_date}</p>
                                </td>

                                {/* Campo Destacado */}
                                <td className='hidden xl:table-cell px-5 py-4'>
                                    <FeaturedMark featured={post.featured} />
                                </td>

                                {/* Acciones */}
                                <td className="px-4 xl:px-5 py-4">
                                    <PostActions />
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Vista mobile: lista de tarjetas, acciones a la derecha */}
            <div className="md:hidden divide-y divide-border/50">
                {posts.map((post, i) => (
                    <div key={i} className={`capitalize flex items-center gap-3 px-4 py-3 hover:bg-accent/20 transition-colors`}>
                        <div className="min-w-0 flex-1 flex flex-col gap-1.5">
                            {/* Titulo + Destacado */}
                            <div className="flex items-center gap-2">
                                <p className="min-w-0 flex-1 text-sm font-semibold text-mizume-primary-foreground truncate">{post.title.replaceAll('-', ' ')}</p>
                                <FeaturedMark featured={post.featured} />
                            </div>

                            {/* Estado + Fecha */}
                            <div className="flex flex-wrap items-center gap-2">
                                <StatusBadge lang={lang} post={post} />
                                {post.publish_date && (
                                    <p className="text-[11px] font-light text-mizume-primary-foreground">{post.publish_date}</p>
                                )}
                            </div>
                        </div>

                        {/* Acciones: en pantallas muy estrechas bajan en columna */}
                        <div className="shrink-0 [&>div]:flex-col min-[400px]:[&>div]:flex-row">
                            <PostActions />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}



