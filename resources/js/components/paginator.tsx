import { useT } from '@/hooks/use-paginator'
import { Link } from '@inertiajs/react'



interface PaginationProps {
    prevUrl: string | null
    nextUrl: string | null
    current: number
    last: number
    labels: { prev: string; next: string; page: string },
    classBTN?: string,
    spanClass: string,
}

const BTN = 'rounded-full border-2 border-black bg-mizume-secondary text-mizume-secondary-foreground px-4 py-1.5 text-sm font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'

interface PageButtonProps {
    url: string | null,
    children: React.ReactNode,
    classBTN?: string,
}

const PageButton = ({ url, children, classBTN }: PageButtonProps) =>
    url ? (
        <Link href={url} only={['paginated']} preserveScroll className={`${classBTN === undefined ? BTN : classBTN} transition-transform hover:-translate-y-0.5`}>
            {children}
        </Link>
    ) : (
        <span aria-disabled="true" className={`${classBTN === undefined ? BTN : classBTN} opacity-40 shadow-none`}>
            {children}
        </span>
    )



export const Pagination = ({ prevUrl, nextUrl, current, last, labels, classBTN, spanClass }: PaginationProps) => {
    const t = useT().pagination
    if (last <= 1) return null

    return (
        <nav aria-label="Paginación" className="mt-2 flex items-center justify-center gap-3 sm:gap-5">
            <PageButton url={prevUrl} classBTN={classBTN}>← {labels.prev}</PageButton>
            <span aria-current="page" className={`${spanClass}`}>
                {labels.page} {current} / {last}
            </span>
            <PageButton url={nextUrl} classBTN={classBTN}>{labels.next} →</PageButton>
        </nav>
    )
}