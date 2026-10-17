import { Link } from '@inertiajs/react'

interface PaginationProps {
    prevUrl: string | null
    nextUrl: string | null
    current: number
    last: number
    labels: { prev: string; next: string; page: string }
}

const BTN = 'rounded-full border-2 border-black bg-card px-4 py-1.5 text-sm font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'

const PageButton = ({ url, children }: { url: string | null; children: React.ReactNode }) =>
    url ? (
        <Link href={url} only={['works']} className={`${BTN} transition-transform hover:-translate-y-0.5`}>
            {children}
        </Link>
    ) : (
        <span aria-disabled="true" className={`${BTN} opacity-40 shadow-none`}>
            {children}
        </span>
    )

export const Pagination = ({ prevUrl, nextUrl, current, last, labels }: PaginationProps) => {
    if (last <= 1) return null

    return (
        <nav aria-label="Paginación" className="mt-2 flex items-center justify-center gap-3 sm:gap-5">
            <PageButton url={prevUrl}>← {labels.prev}</PageButton>
            <span aria-current="page" className="text-sm font-bold text-black">
                {labels.page} {current} / {last}
            </span>
            <PageButton url={nextUrl}>{labels.next} →</PageButton>
        </nav>
    )
}