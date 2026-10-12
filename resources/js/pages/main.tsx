
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



function main({ works, posts }: MainProps) {

  console.log(works)
  return (
    <BlogLayout>
      <BlogWidgetWrap>
        <BlogWidget variant='work' />
        <BlogWidget variant='post' />
        <BlogWidget variant='author' />
      </BlogWidgetWrap>
      <BlogMain>
        <BlogSection variant='left' works={works} />
        <BlogSection variant='right' works={works} />
      </BlogMain>
    </BlogLayout>
  )
}

export default main