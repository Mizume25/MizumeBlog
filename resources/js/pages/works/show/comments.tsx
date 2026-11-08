import { BlocComents } from "@/blocs/bloc-post"
import WorkShowLayout from "@/layouts/app/work-show-layout"
import { WorkShowCommentsProps } from "@/types/custom/work-show-types"

/**
 * works/show/comments: los comentarios como entidad propia.
 * `comments` llega resuelto del servidor (WorkPostController@comments);
 * escribir, refrescar o el polling solo vuelven a pedir esa prop.
 */
function WorkShowComments({ post, comments }: WorkShowCommentsProps) {
  return <BlocComents post_id={post.id} comments={comments} />
}

WorkShowComments.layout = WorkShowLayout

export default WorkShowComments
