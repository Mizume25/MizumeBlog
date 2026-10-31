
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
import { ROUTE } from '@/constants/routes';
import { Route } from '@/types';




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


const routes : Route[] = [
  {
    label:"Home",
    url: ROUTE.main,
  }
]


function main({ works, posts }: MainProps) {

  /** Variable de estado de lenguaje */
  const lang = useLangStore((l) => l.lang)

  /** Works y estado de variable */
  const { work, changeWork } = useMainHook(works[0])

  /** Contenido de la pagina */
  const CONTENT = DATA[lang]

  /** Contenido de entidades */
  const ENTITIES = DATA_ENTITIES[lang]   

  /** Usuarios relacionales  */
  const users = onUsers(posts)


  return (
    <BlogLayout routes={routes}>
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