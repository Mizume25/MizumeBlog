
import {
  BlogLayout,
  BlogWidget,
} from '@/layouts/app'
import {
  MainProps,
  BlogMain,
  BlogSection,
  BlogWidgetWrap
} from '@/core/desktop/main-components'
import { useMainHook } from '@/hooks/custom/main-hook'



function main({ works, posts }: MainProps) {


  const { work , changeWork} = useMainHook(works[0])
  
  return (
    <BlogLayout>
      <BlogWidgetWrap>
        <BlogWidget variant='work' />
        <BlogWidget variant='post' />
        <BlogWidget variant='author' />
      </BlogWidgetWrap>
      <BlogMain>
        <BlogSection variant='left' works={works} work={work} posts={posts} changeWork={changeWork}  />
        <BlogSection variant='right' works={works} work={work} posts={posts} changeWork={changeWork} />
      </BlogMain>
    </BlogLayout>
  )
}

export default main