import { type DATA_MAIN } from '@/constants/main-constants'
import { BookBookmark, NotebookTextIcon, UserCircle2, TurtleIcon } from 'lucide-react'


type WidgetType = "author" | "work" | "post"

interface BlogWidgetProps {
  variant: WidgetType,
  content: DATA_MAIN,
}



const FALLBACK = { Icon: TurtleIcon, label: "Not Found" }

function BlogWidget({ variant, content }: BlogWidgetProps) {

  const VARIANTS = {
  author: { Icon: UserCircle2, label: content.widget.authors },
  post: { Icon: NotebookTextIcon, label: content.widget.posts },
  work: { Icon: BookBookmark, label: content.widget.work },
} as const

  const { Icon, label } = VARIANTS[variant as keyof typeof VARIANTS] ?? FALLBACK

  return (
    <div className="@container flex aspect-square items-center justify-center rounded-xl bg-mizume-secondary p-2 transition-colors duration-500 ease-in-out hover:bg-mizume-primary sm:aspect-video sm:p-4">
      <figure className="flex cursor-pointer flex-col items-center justify-center gap-1 transition-transform duration-300 hover:scale-110">
        <Icon className="size-[42cqw] max-h-36 max-w-36 text-mizume-tertiary" />
        <h3 className="title text-[length:clamp(0.75rem,13cqw,1.5rem)] leading-tight">
          {label}
        </h3>
      </figure>
    </div>
  )
}

export default BlogWidget