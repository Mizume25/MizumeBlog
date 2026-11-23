import { MediaFilter } from "@/constants/media-constants"
import MediaLibrary from "@/core/library/media-library"
import { BlogLayout } from "@/layouts/app"
import { Route } from "@/types"
import { Media, MediaItem, Paginated, Work } from "@/types/definitions"
import { Head } from "@inertiajs/react"

interface MediaIndexProps {
  paginated: Paginated<Media>,
  works: Work [],
  filters: MediaFilter
}

const routes: Route[] = [
    {
        label: "Workshop",
        url: route("panel.workshop")
    },
    {
        label: "Media",
        url: route("panel.workshop.media")
    }
]

function MediaIndex({ paginated, works, filters } : MediaIndexProps) {


  return (
    <BlogLayout routes={routes}>
        <Head title="Media" />
        <MediaLibrary files={paginated.data} paginated={paginated} works={works} />
        
    </BlogLayout>
  )
}

export default MediaIndex