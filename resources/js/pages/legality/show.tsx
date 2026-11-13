import { BlocPostReader } from '@/blocs/bloc-post-reader'
import { BlogLayout } from '@/layouts/app'
import { Route } from '@/types'
import { Author, PostBuild, PostRecord } from '@/types/definitions'


interface LegalityShowProps {
    post: PostRecord,
    build: PostBuild,
    code: string,
    title: string,
}


function LegalityShow({ post, build, code, title }: LegalityShowProps) {

    const routes: Route[] = [
        {
            label: title,
            url: route("legality.show", code)
        },
    ]

    return (
        <BlogLayout routes={routes}>
            <BlocPostReader post={post} build={build} />
        </BlogLayout>
    )
}

export default LegalityShow