
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
import { PostsGroupedByUser } from '@/types/definitions';

/**
 * 
 * @param posts Filtra usuarios agrupados
 * @returns 
 */
export function onUsers(posts : PostsGroupedByUser) {
  const users = Object.values(posts)
    .flat()
    .map((post) => post.user);

  return [...new Map(users.map((user) => [user.id, user] as const)).values()];
}



function main({ works, posts }: MainProps) {


  const { work, changeWork } = useMainHook(works[0])
  

  const users = onUsers(posts)

  return (
    <BlogLayout>
      <BlogWidgetWrap>
        <BlogWidget variant='work' />
        <BlogWidget variant='post' />
        <BlogWidget variant='author' />
      </BlogWidgetWrap>
      <BlogMain>
        <BlogSection variant='left' works={works} work={work} posts={posts} changeWork={changeWork} users={users}  />
        <BlogSection variant='right' works={works} work={work} posts={posts} changeWork={changeWork} users={users} />
      </BlogMain>
    </BlogLayout>
  )
}

export default main