import {
    BlogLayout,
    BlogWidget
} from '@/layouts/app'

function main() {
  return (
    <BlogLayout>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <BlogWidget variant='work' />
        <BlogWidget variant='post' />
        <BlogWidget variant='author' />
      </div>
      <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" >

      </div>
    </BlogLayout>
  )
}

export default main