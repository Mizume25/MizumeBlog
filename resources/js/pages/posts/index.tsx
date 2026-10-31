import { BlocContent } from "@/blocs/bloc-filter"
import { ROUTE } from "@/constants/routes"
import { PostIndexMain } from "@/core/desktop/post-index-components"
import { BlogLayout } from "@/layouts/app"
import { Route } from "@/types"

const routes : Route[] = [
    {
        label:"Home",
        url: ROUTE.main,
    }, 
    {
        label:"Posts",
        url: ROUTE.post.index
    }
]


function PostIndex() {
  return (
    <BlogLayout routes={routes}>
        <BlocContent title="Opciones de Filtrado">
          <div>
            
          </div>
        </BlocContent>
      <PostIndexMain>
        <div>

        </div>
      </PostIndexMain>
    </BlogLayout>
  )
}

export default PostIndex