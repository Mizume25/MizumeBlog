
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

/** Textos */
const DATA = {
  es: {
    widget: {
      work: "Obras",
      posts: "Publicaciones",
      authors: "Autores"
    },
    work: {
      category: "Categoria",
      publish_date: "Fecha Pub.",
      medium: "Medio",
      tags: "Etiquetas",
      sinopsi: "Sinopsi",
      authors: "Autores"

    }
  },
  en: {
    widget: {
      work: "Work",
      posts: "Posts",
      authors: "Authors"
    },
    work: {
      category: "Category",
      publish_date: "Publish date",
      authors: "Author",
      medium: "Medium",
      tags: "Tags",
      sinopsi: "Synopsis"
    }
  }
}

export type DATA_MAIN = (typeof DATA.es)

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
  const content = DATA[lang]

  const users = onUsers(posts)

  return (
    <BlogLayout>
      <BlogWidgetWrap>
        <BlogWidget variant='work' content={content} />
        <BlogWidget variant='post' content={content} />
        <BlogWidget variant='author' content={content} />
      </BlogWidgetWrap>
      <BlogMain>
        <BlogSection variant='left' works={works} work={work} posts={posts} changeWork={changeWork} users={users}  content={content}  />
        <BlogSection variant='right' works={works} work={work} posts={posts} changeWork={changeWork} users={users}  content={content}   />
      </BlogMain>
    </BlogLayout>
  )
}

export default main