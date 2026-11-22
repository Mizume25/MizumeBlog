import { CommentRecord, Paginated, PostBuild, PostRecord, User, WorkRecord } from "../definitions"


/** Pestañas de gestión del post: valores fijos, no se traducen (solo sus labels) */
export type PostManageTab = "posts" | "comments" | "reports"

export interface PostUserFilter {
  search?: string | null,
}

export interface ArticleProps {
  children?: React.ReactNode
  className?: string
}

export interface PageProgressProps {
  /** Sección actual (base 0) */
  section: number
  /** Total de secciones del post */
  total: number
}

/* ───────────── Props de las páginas que comparten WorkShowLayout ───────────── */

/** Props comunes: las recibe también el layout (Inertia le pasa las props de la página) */
export interface WorkShowContextProps {
  work: WorkRecord,
  /** Solo existe en las páginas de un post (posts / comments / reports) */
  post?: PostRecord,
}

/** works/show/index: listado de posts del work */
export interface WorkShowIndexProps extends WorkShowContextProps {
  paginated: Paginated<PostRecord>,
  users: User[],
  filters: PostUserFilter
}

/** works/show/post: contenido maquetado */
export interface WorkShowPostProps extends WorkShowContextProps {
  post: PostRecord,
  build: PostBuild
}

/** works/show/comments: hilo de comentarios */
export interface WorkShowCommentsProps extends WorkShowContextProps {
  post: PostRecord,
  comments: CommentRecord[]
}

/** works/show/reports */
export interface WorkShowReportsProps extends WorkShowContextProps {
  post: PostRecord
}
