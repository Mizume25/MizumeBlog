import { BookBookmark, NotebookTextIcon, UserCircle2, TurtleIcon } from 'lucide-react'
import { WithDepth } from 'motion/react'


type WidgetType = "author" | "work" | "post"

interface BlogWidgetProps {
  variant: WidgetType
}

function BlogWidget({ variant }: BlogWidgetProps) {

  const content = "flex flex-col justify-center items-center transition-transform hover:scale-115 cursor-pointer duration-300"
  const figure = "text-mizume-tertiary w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36"
  const subtitle = "title text-2xl"

  const RenderTypeIcon = () => {
    switch (variant) {
      case "author":
        return (
          <figure className={content}>
            <UserCircle2 size={150} className={figure} />
            <h3 className={subtitle}>Autores</h3>
          </figure>
        )
      case "post":
        return (
          <figure className={content}>
            <NotebookTextIcon size={150} className={figure} />
            <h3 className={subtitle}>Posts</h3>
          </figure>
        )
      case "work":
         return (
          <figure className={content}>
            <BookBookmark size={150} className={figure} />
            <h3 className={subtitle}>Obras</h3>
          </figure>
        )
      default:
         return (
          <figure className={content}>
            <TurtleIcon size={150} className={figure} />
            <h3 className={subtitle}>Not Found</h3>
          </figure>
        )
    }
  }


  return (
    <div className="w-75 h-75 rounded-xl bg-mizume-secondary flex justify-center items-center p-4">
      <RenderTypeIcon />
    </div>
  )
}

export default BlogWidget