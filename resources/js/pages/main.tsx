
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
import { useLangStore } from '@/store/lang-store';
import { DATA_ENTITIES } from '@/core/desktop/utils-components';
import { DATA } from '@/constants/main-constants';




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

  const lang = useLangStore((l) => l.lang)
  const { work, changeWork } = useMainHook(works[0])
  const CONTENT = DATA[lang]
  const ENTITIES = DATA_ENTITIES[lang]   

  const users = onUsers(posts)

  console.log(works)

  return (
    <BlogLayout>
      <BlogWidgetWrap>
        <BlogWidget variant='work' content={CONTENT} />
        <BlogWidget variant='post' content={CONTENT} />
        <BlogWidget variant='author' content={CONTENT} />
      </BlogWidgetWrap>
      <BlogMain>
        <BlogSection variant='left' works={works} work={work} posts={posts} changeWork={changeWork} users={users}  ENTITIES={ENTITIES}  />
        <BlogSection variant='right' works={works} work={work} posts={posts} changeWork={changeWork} users={users}  ENTITIES={ENTITIES}   />
      </BlogMain>
    </BlogLayout>
  )
}

export default main