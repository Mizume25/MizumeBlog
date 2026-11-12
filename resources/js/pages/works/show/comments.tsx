import { Head } from "@inertiajs/react"
import { BlocComents } from "@/blocs/bloc-post"
import WorkShowLayout from "@/layouts/app/work-show-layout"
import { useLangStore } from "@/store/lang-store"
import { DATA_WORK_SHOW } from "@/constants/work-show-constants"
import { WorkShowCommentsProps } from "@/types/custom/work-show-types"

/**
 * works/show/comments: los comentarios como entidad propia.
 * `comments` llega resuelto del servidor (WorkPostController@comments);
 * escribir, refrescar o el polling solo vuelven a pedir esa prop.
 */
function WorkShowComments({ post, comments }: WorkShowCommentsProps) {

  const lang = useLangStore((l) => l.lang)

  return (
    <>
      <Head title={DATA_WORK_SHOW[lang].heads.comments} />
      <BlocComents post_id={post.id} comments={comments} />
    </>
  )
}

WorkShowComments.layout = WorkShowLayout

export default WorkShowComments
