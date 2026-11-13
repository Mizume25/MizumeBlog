/**
 * @fileoverview Bloque de metricas he informacion
 */
import { Lang } from "@/store/lang-store";
import { PostRecord, Tag } from "@/types/definitions";

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
        title:"Ultima Publicacion Editada"
    },
    en:{
        title:"Last Edited Post"
    }
}

export const InfoLastPost = ({ posts , lang }: InfoLastPostProps) => {



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