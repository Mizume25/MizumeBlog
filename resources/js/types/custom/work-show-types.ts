import { Work } from "../definitions"



export interface ArticleProps {
  children?: React.ReactNode
  className?: string
}

export interface PageProgressProps {
  /** Elemento cuyo recorrido se mide (p. ej. WorkShowMain) */
  targetRef: React.RefObject<HTMLElement | null>
}
