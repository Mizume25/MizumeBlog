import { BlocPostReader } from '@/blocs/bloc-post-reader'
import { BlogLayout } from '@/layouts/app'
import { Route } from '@/types'
import { Author, PostBuild, PostRecord } from '@/types/definitions'


interface AuthorsShowProps {
    post: PostRecord,
    build: PostBuild,
    author: Author
}


function AuthorsShow({ post, build, author }: AuthorsShowProps) {

    const routes: Route[] = [
    {
        label: "Home",
        url: route("main"),
    },
    {
        label: "Authors",
        url:route("authors.index")
    },
    {
        label: author.name ?? author.last_name ?? author.pseudonym ?? "¿ ... ?",
        url: route("authors.show", author.slug)
    }
]

    return (
        <BlogLayout routes={routes}>
            <BlocPostReader post={post} build={build} />
        </BlogLayout>
    )
}

export default AuthorsShow