import { Pagination } from "@/components/paginator"
import { DATA_MEDIA } from "@/constants/media-constants"
import { MediaFilters, MediaGrid, MediaMain } from "@/core/desktop/media-components"
import { PaginatedText } from "@/lib/utils"
import { useLangStore } from "@/store/lang-store"
import { Media, Paginated, Work } from "@/types/definitions"

interface MediaLibraryProps {
    files: Media[]
    paginated: Paginated<Media>
    works: Pick<Work, "id" | "title">[]
}

function MediaLibrary({ files, paginated, works }: MediaLibraryProps) {

    const lang = useLangStore((l) => l.lang)

    const DATA = DATA_MEDIA[lang]

    return (
        <MediaMain>
            <MediaFilters DATA={DATA} works={works} />
            <MediaGrid files={files} DATA={DATA} />
            <div className="col-span-full">
                <Pagination
                    prevUrl={paginated.prev_page_url}
                    nextUrl={paginated.next_page_url}
                    current={paginated.current_page}
                    last={paginated.last_page}
                    labels={PaginatedText[lang]}
                    spanClass='text-sm font-bold text-mizume-secondary-foreground'
                />
            </div>
        </MediaMain>
    )
}

export default MediaLibrary
