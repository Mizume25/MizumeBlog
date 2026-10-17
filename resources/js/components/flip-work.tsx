import * as React from 'react'
import { easeOut, motion } from 'motion/react'
import { formatDate } from '@/lib/utils'
import type { WorkRecord } from '@/types/definitions'
import { BlogItems } from '@/core/desktop/utils-components'
import { type WORK_LABELS } from '@/core/desktop/utils-components'



interface BlogCardWorkProps {
    work: WorkRecord
    labels: WORK_LABELS
}

const FACE = 'absolute inset-0 flex flex-col overflow-hidden rounded-[25px] border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
const FACE_STYLE: React.CSSProperties = {
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
}

const DESKTOP_ONLY = 'hidden lg:flex'
const MOBILE_ONLY  = 'flex lg:hidden'

/** Cabecera compartida por las dos caras */
const CardHeader = ({ work }: { work: WorkRecord }) => (
    <header className="flex h-11.5 shrink-0 items-center justify-between border-b-2 border-black bg-card px-4 text-black">
        <h2 className="truncate pr-2 text-sm font-bold tracking-tight uppercase">
            {work.title.replaceAll('-', ' ')}
        </h2>
        <div className="flex shrink-0 gap-1">
            <span className="rounded-full bg-badge px-3 py-1 text-[0.6rem] font-bold text-white uppercase">
                {work.medium.replaceAll('_', ' ')}
            </span>

        </div>
    </header>
)

export const FlipWork = ({ work, labels }: BlogCardWorkProps) => {
    const [isFlipped, setIsFlipped] = React.useState(false)

    // Se evalúa al ocurrir el evento (no en el render), así no rompe SSR ni portátiles táctiles
    const canHover = () =>
        typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

    const info: Record<string, unknown> = {
        category: work.category,
        abbreviation: work.abbreviation,
        publish_date: work.publish_date,
        medium: work.medium,
        authors: work.authors,
    }

    return (
        <div
            role="button"
            tabIndex={0}
            aria-pressed={isFlipped}
            className="group relative h-96 w-full cursor-pointer focus:outline-none sm:h-80"
            style={{ perspective: 1000 }}
            onMouseEnter={() => canHover() && setIsFlipped(true)}
            onMouseLeave={() => canHover() && setIsFlipped(false)}
            onClick={() => !canHover() && setIsFlipped((f) => !f)}
            onFocus={() => setIsFlipped(true)}
            onBlur={() => setIsFlipped(false)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setIsFlipped((f) => !f)
                }
            }}
        >
            <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5, ease: easeOut }}
            >
                {/* FRONT: cover izquierda + información derecha */}
                <div className={FACE} style={FACE_STYLE}>
                    <CardHeader work={work} />

                    <CardMain>
                        <CardSectionLeft work={work} />
                        <CardSectionInfo className={DESKTOP_ONLY} info={info} labels={labels} work={work} />
                    </CardMain>
                </div>

                {/* BACK: extracto de la sinopsis */}
                <div className={FACE} style={{ ...FACE_STYLE, transform: 'rotateY(180deg)' }}>
                    <CardHeader work={work} />
                    <CardSectionSinopsi className={DESKTOP_ONLY}  labels={labels} work={work} />
                    <CardSectionInfo className={MOBILE_ONLY} info={info} labels={labels} work={work} />
                </div>
            </motion.div>
        </div>
    )
}

interface CardMainProps {
    children: React.ReactNode
}

const CardMain = ({ children }: CardMainProps) => {
    return (
        <main className="flex h-full flex-row overflow-hidden">
            {children}
        </main>
    )
}

interface CardSectionLeftProps {
    work: WorkRecord
}


const CardSectionLeft = ({ work }: CardSectionLeftProps) => {
    return (
        <section className="w-full shrink-0 overflow-hidden bg-[#e5e5e5] lg:w-[35%] lg:border-r-2 lg:border-black/20">
            {work.cover_url ? (
                <img
                    src={work.cover_url}
                    alt={`Portada de ${work.title}`}
                    className="h-full w-full  object-cover object-top"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl opacity-30">📖</div>
            )}
        </section>
    )
}

interface CardSectionInfoProps {
    work: WorkRecord,
    info: Record<string, unknown>,
    labels: WORK_LABELS,
    className: string
}

const CardSectionInfo = ({ work, info, labels, className }: CardSectionInfoProps) => {
    return (
        <section className={`${className} flex-1 flex-col gap-3 overflow-y-auto bg-card-foreground p-4 text-black [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/20`}>
            <BlogItems
                data={info}
                formatKey={(key) => (labels as Record<string, string>)[key] ?? key}
                formatValue={(value, key) => {
                    if (key === 'publish_date' && typeof value === 'string') return formatDate(value)
                    if (key === 'authors' && Array.isArray(value)) {
                        return value
                            .map((a) => [a.name, a.last_name].filter(Boolean).join(' ') || a.pseudonym)
                            .filter(Boolean)
                            .join(', ') || '—'
                    }
                    return String(value ?? '—').replaceAll('_', ' ')
                }}
            />

            {work.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    <p className="w-full text-sm capitalize">{labels.tags}:</p>
                    {work.tags.map((tag) => (
                        <span
                            key={tag.id}
                            className="rounded-lg bg-mizume-secondary px-2 py-0.5 text-xs text-white"
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>
            )}
        </section>
    )
}

interface CardSectionSinopsiProps {
    work: WorkRecord,
    labels: WORK_LABELS,
    className: string
}

const CardSectionSinopsi = ({ work, labels, className }: CardSectionSinopsiProps) => {
    return (
        <main className={`${className} flex-1 flex-col overflow-hidden bg-card-foreground p-4 text-black`}>
            <h3 className="mb-2 text-lg font-bold">{labels.sinopsi}</h3>
            <p
                lang="es"
                className="line-clamp-7 hyphens-auto break-words text-start text-xs leading-relaxed sm:text-sm"
            >
                {work.sinopsi}
            </p>
        </main>
    )
}