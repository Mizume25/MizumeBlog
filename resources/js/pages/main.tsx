
import React from 'react'
import {
  BlogLayout,
  BlogWidget
} from '@/layouts/app'
import { BlogFeatureCard } from '@/layouts/app/blog-feature-card'

interface BlogContentProps {
  children: React.ReactNode
}

/** Contenedor Superior */
export const BlogWidgetWrap = ({ children }: BlogContentProps) => {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3" >
      {children}
    </div>
  )
}

/**
 * Contenedor Inferior
 * @param param0 
 * @returns 
 */
export const BlogMain = ({ children }: BlogContentProps) => {
  return (
    <div className="min-h-screen flex-1 rounded-xl md:min-h-min bg-mizume-secondary text-mizume-secondary-foreground" >
      {children}
    </div>
  )
}

function main() {
  return (
    <BlogLayout>
      <BlogWidgetWrap>
        <BlogWidget variant='work' />
        <BlogWidget variant='post' />
        <BlogWidget variant='author' />
      </BlogWidgetWrap>
      <BlogMain>
        <div />
      </BlogMain>
    </BlogLayout>
  )
}

export default main