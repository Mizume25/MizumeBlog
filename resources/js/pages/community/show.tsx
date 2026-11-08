import { BlocPostReader } from '@/blocs/bloc-post-reader'
import { BlogLayout } from '@/layouts/app'
import { Route } from '@/types'
import { PostBuild, PostRecord } from '@/types/definitions'

const routes: Route[] = [
    {
        label: "Home",
        url: route("main"),
    },
    {
        label: "Community",
        url: route("community")
    }
]

interface CommunityShowProps {
    post: PostRecord,
    build: PostBuild
}

/** community/show: página única de la comunidad leída por secciones */
function CommunityShow({ post, build }: CommunityShowProps) {
    return (
        <BlogLayout routes={routes}>
            <BlocPostReader post={post} build={build} />
        </BlogLayout>
    )
}

export default CommunityShow
