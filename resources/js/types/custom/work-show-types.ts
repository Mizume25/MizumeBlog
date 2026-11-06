import { Work } from "../definitions"


export type WorkShowTab = "index" | "post"

/** Pestañas de gestión del post: valores fijos, no se traducen (solo sus labels) */
export type PostManageTab = "posts" | "comments" | "reports"

export interface PostUserFilter {
  search?: string | null,
}

/** Orden de los posts de un work: por fecha de publicación o alfabético por usuario */
export type PostOrder = "date" | "alpha"

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
